import { useState, useContext, useRef, useEffect } from 'react';
import { Form, Input, Spin, message, Modal } from 'antd';
import { MdCameraAlt, MdEdit, MdSave, MdClose, MdLock } from 'react-icons/md';
import { MainContext } from '@/context';
import { updateProfileData, UpdateProfilePicture, updateAdminEmail } from '@/network/profile';
import { handleFetchUser } from '@/network/user';
import { CURRENT_USER } from '@/context/types';
import useNotification from '@/hooks/useNotification';

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?';
}

function InfoCard({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 24px', borderBottom: '1px solid #f1f5f9' }}>
        <p style={{ margin: 0, fontSize: '.78rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em' }}>{title}</p>
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const STATIC_STYLE = {
  display: 'flex', alignItems: 'center', height: 40,
  padding: '0 12px', background: '#f8fafc',
  border: '1px solid #e2e8f0', borderRadius: 8,
  fontSize: '.84rem', color: '#374151',
};

export default function AdminProfile() {
  const [editMode, setEditMode]         = useState(false);
  const [saving, setSaving]             = useState(false);
  const [uploading, setUploading]       = useState(false);
  const [previewUrl, setPreviewUrl]     = useState(null);
  const [pendingFile, setPendingFile]   = useState(null);
  const [emailModal, setEmailModal]     = useState(false);
  const [emailSaving, setEmailSaving]   = useState(false);
  const fileInputRef = useRef(null);
  const [success, error] = useNotification();
  const { state: { user }, dispatch } = useContext(MainContext);
  const [form] = Form.useForm();
  const [emailForm] = Form.useForm();

  const isSuperAdmin = user?.userRoles === 'super_admin';

  useEffect(() => {
    handleFetchUser()
      .then((fresh) => {
        if (fresh?.data?.body?.user) {
          dispatch({ type: CURRENT_USER, payload: { ...fresh.data.body.user } });
        }
      })
      .catch(() => {});
  }, []);

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      message.error('JPG or PNG only');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error('Max 5 MB');
      return;
    }
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let values;
      try {
        values = await form.validateFields();
      } catch {
        setSaving(false);
        return;
      }

      if (pendingFile) {
        setUploading(true);
        const res = await UpdateProfilePicture({ profilePicture: pendingFile });
        const updatedImage = res?.data?.body?.profileImage;
        if (updatedImage) dispatch({ type: 'UPDATE_USER', payload: { profileImage: updatedImage } });
        setPendingFile(null);
        setPreviewUrl(null);
        setUploading(false);
      }

      const payload = {};
      if (values.fullName?.trim()) payload.fullName = values.fullName.trim();
      if (values.phoneNumber !== undefined && values.phoneNumber !== null) payload.phoneNumber = values.phoneNumber;

      if (Object.keys(payload).length > 0) {
        await updateProfileData(payload);
        const fresh = await handleFetchUser();
        dispatch({ type: CURRENT_USER, payload: { ...fresh?.data?.body?.user } });
      }

      success('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      error(err?.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setPendingFile(null);
    setPreviewUrl(null);
    form.setFieldsValue({ fullName: user?.fullName || '', phoneNumber: user?.phoneNumber || '' });
  };

  const handleEmailChange = async () => {
    let values;
    try { values = await emailForm.validateFields(); } catch { return; }
    setEmailSaving(true);
    try {
      await updateAdminEmail({ newEmail: values.newEmail, password: values.password });
      const fresh = await handleFetchUser();
      dispatch({ type: CURRENT_USER, payload: { ...fresh?.data?.body?.user } });
      success('Email address updated successfully.');
      setEmailModal(false);
      emailForm.resetFields();
    } catch (err) {
      error(err?.response?.data?.message || 'Failed to update email.');
    } finally {
      setEmailSaving(false);
    }
  };

  const avatarSrc = previewUrl || user?.profileImage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 780 }}>

      {/* Profile hero */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>

        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%', overflow: 'hidden',
            background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid #e2e8f0', position: 'relative',
          }}>
            {uploading
              ? <Spin />
              : avatarSrc
                ? <img src={avatarSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#9ca3af' }}>{initials(user?.fullName)}</span>
            }
          </div>
          {editMode && (
            <>
              <button
                onClick={handleAvatarClick}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--oosriPrimary)', color: '#fff',
                  border: '2px solid #fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <MdCameraAlt size={14} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={handleFileChange} />
            </>
          )}
        </div>

        {/* Name & role */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>{user?.fullName || '—'}</h2>
          <p style={{ margin: '0 0 8px', fontSize: '.84rem', color: '#6b7280' }}>{user?.email}</p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: '#eff6ff', color: '#1d4ed8', fontSize: '.73rem', fontWeight: 700 }}>
            Administrator
          </span>
        </div>

        {/* Edit / Save / Cancel */}
        <div style={{ display: 'flex', gap: 8 }}>
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 16px', background: 'var(--oosriPrimary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.84rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .65 : 1, fontFamily: 'inherit' }}
              >
                <MdSave size={16} />{saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 8, fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <MdClose size={16} />Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => { setEditMode(true); form.setFieldsValue({ fullName: user?.fullName || '', phoneNumber: user?.phoneNumber || '' }); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 16px', background: '#f1f5f9', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <MdEdit size={16} />Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Details card */}
      <Form form={form} layout="vertical" initialValues={{ fullName: user?.fullName || '', phoneNumber: user?.phoneNumber || '' }}>
        <InfoCard title="Account Information">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>

            <FieldRow label="Full Name">
              {editMode
                ? <Form.Item name="fullName" style={{ margin: 0 }} rules={[{ required: true, message: 'Name is required' }]}>
                    <Input style={{ height: 40 }} placeholder="Full name" />
                  </Form.Item>
                : <div style={STATIC_STYLE}>{user?.fullName || '—'}</div>
              }
            </FieldRow>

            <FieldRow label="Email Address">
              <div style={{ ...STATIC_STYLE, justifyContent: 'space-between' }}>
                <span>{user?.email || '—'}</span>
                {isSuperAdmin ? (
                  <button
                    onClick={() => { emailForm.resetFields(); setEmailModal(true); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--oosriPrimary)', fontSize: '.78rem', fontWeight: 600, padding: 0, fontFamily: 'inherit' }}
                  >
                    Change
                  </button>
                ) : (
                  <MdLock size={14} color="#9ca3af" title="Email cannot be changed" />
                )}
              </div>
            </FieldRow>

            <FieldRow label="Phone Number">
              {editMode
                ? <Form.Item name="phoneNumber" style={{ margin: 0 }}>
                    <Input style={{ height: 40 }} placeholder="+234..." />
                  </Form.Item>
                : <div style={STATIC_STYLE}>{user?.phoneNumber || '—'}</div>
              }
            </FieldRow>

            <FieldRow label="Role">
              <div style={STATIC_STYLE}>Administrator</div>
            </FieldRow>

          </div>
        </InfoCard>
      </Form>

      {/* Security note — only for non-super-admin */}
      {!isSuperAdmin && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 20px', display: 'flex', gap: 10 }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>🔒</span>
          <p style={{ margin: 0, fontSize: '.82rem', color: '#92400e', lineHeight: 1.55 }}>
            Your email address cannot be changed here. Contact platform support if you need to update it.
          </p>
        </div>
      )}

      {/* Email change modal — super_admin only */}
      <Modal
        title="Change Email Address"
        open={emailModal}
        onCancel={() => { setEmailModal(false); emailForm.resetFields(); }}
        onOk={handleEmailChange}
        okText={emailSaving ? 'Saving…' : 'Update Email'}
        okButtonProps={{ disabled: emailSaving, style: { background: 'var(--oosriPrimary)', borderColor: 'var(--oosriPrimary)' } }}
        cancelButtonProps={{ disabled: emailSaving }}
        destroyOnClose
      >
        <p style={{ margin: '0 0 16px', fontSize: '.84rem', color: '#6b7280' }}>
          Enter your new email address and confirm your current password to proceed.
        </p>
        <Form form={emailForm} layout="vertical">
          <Form.Item
            name="newEmail"
            label="New Email Address"
            rules={[
              { required: true, message: 'Please enter a new email address.' },
              { type: 'email', message: 'Please enter a valid email address.' },
            ]}
          >
            <Input placeholder="new@oosri.com" style={{ height: 40 }} />
          </Form.Item>
          <Form.Item
            name="password"
            label="Current Password"
            rules={[{ required: true, message: 'Please confirm your current password.' }]}
            style={{ marginBottom: 0 }}
          >
            <Input.Password placeholder="Enter your password" style={{ height: 40 }} />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
}
