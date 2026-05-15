import styled from "styled-components";

export const AllCategoriesWrapper = styled.div`
  width: 100%;

  .categories__table__section {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
  }

  /* ── toolbar ─────────────────────── */
  .search__body__section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    flex-wrap: wrap;
  }

  .search__section {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 38px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0 12px;
    background: #f8fafc;
    width: 280px;
    transition: border-color .15s, box-shadow .15s;
    &:focus-within {
      border-color: var(--oosriPrimary);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(252,83,83,.1);
    }
  }

  .text__field__custom {
    border: none; outline: none; background: transparent;
    font-size: .83rem; color: #111827; width: 100%; font-family: inherit;
    &::placeholder { color: #9ca3af; }
  }

  .add__btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 38px;
    padding: 0 16px;
    background: var(--oosriPrimary);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: .84rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background .15s;
    &:hover { background: #e03d3d; }
  }

  /* ── table cells ─────────────────── */
  .cat__name { font-weight: 600; color: #111827; font-size: .84rem; }
  .cat__desc { font-size: .82rem; color: #6b7280; }

  .sub__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px; height: 28px;
    background: #f1f5f9;
    border-radius: 6px;
    font-size: .78rem;
    font-weight: 700;
    color: #475569;
  }

  /* ── action popover ──────────────── */
  .action__menu {
    display: flex; flex-direction: column; gap: 2px;
    min-width: 150px; padding: 4px;
    button {
      width: 100%; text-align: left; padding: 7px 10px;
      border-radius: 6px; border: none; background: none;
      font-size: .82rem; color: #374151; cursor: pointer;
      font-family: inherit; transition: background .1s;
      &:hover { background: #f1f5f9; }
      &.danger { color: #dc2626; &:hover { background: #fef2f2; } }
    }
  }

  /* ── modal form ──────────────────── */
  .attr__heading { font-size: .88rem; font-weight: 700; color: #111827; margin: 8px 0 12px; }

  .attr__row {
    display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px;
    .remove__attr__btn {
      background: none; border: none; color: #dc2626;
      font-size: .78rem; cursor: pointer; font-family: inherit;
      margin-top: 28px; padding: 0; white-space: nowrap;
      &:hover { text-decoration: underline; }
    }
  }

  .add__attr__btn {
    width: 100%; height: 38px; border: 1px dashed #d1d5db;
    background: #fafafa; color: #6b7280; border-radius: 8px;
    font-size: .82rem; cursor: pointer; font-family: inherit;
    transition: all .15s;
    &:hover { border-color: var(--oosriPrimary); color: var(--oosriPrimary); }
  }

  .upload__btn {
    display: inline-flex; align-items: center; gap: 6px;
    height: 36px; padding: 0 14px;
    border: 1px solid #e2e8f0; border-radius: 8px;
    background: #f8fafc; color: #374151;
    font-size: .82rem; cursor: pointer; font-family: inherit;
    transition: all .15s;
    &:hover { border-color: var(--oosriPrimary); color: var(--oosriPrimary); }
  }

  .submit__btn {
    width: 100%; height: 42px;
    background: var(--oosriPrimary); color: #fff;
    border: none; border-radius: 8px;
    font-size: .88rem; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: background .15s;
    &:hover:not(:disabled) { background: #e03d3d; }
    &:disabled { opacity: .65; cursor: not-allowed; }
  }

  /* ── AntD table overrides ────────── */
  .ant-table-thead > tr > th {
    background: #f8fafc !important;
    font-size: .75rem; font-weight: 600; color: #6b7280;
    text-transform: uppercase; letter-spacing: .04em;
    border-bottom: 1px solid #e2e8f0 !important;
  }
  .ant-table-tbody > tr > td {
    font-size: .84rem; color: #374151;
    border-bottom: 1px solid #f1f5f9 !important;
    padding: 12px 16px;
  }
  .ant-table-tbody > tr:hover > td { background: #fafbfc !important; }
  .ant-pagination { padding: 12px 20px; display: flex; justify-content: flex-end; }
`;
