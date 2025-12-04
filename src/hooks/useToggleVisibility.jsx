import { useQueryClient } from '@tanstack/react-query';
import { toggleProductVisibility } from '@/network/product';

export const useToggleVisibility = (setToggleLoading, tempSetProducts) => {
  const queryClient = useQueryClient();

  const handleToggle = async (checked, obj) => {
    const id = obj._id;

    tempSetProducts((prev) =>
      prev.map((product) =>
        product._id === id ? { ...product, isVisible: checked } : product
      )
    );

    setToggleLoading((prev) => ({ ...prev, [id]: true }));

    try {
      await toggleProductVisibility(id, { isVisible: checked });
      queryClient.invalidateQueries(['products']);
    } catch (error) {
      console.error('Toggle visibility failed:', error);

      tempSetProducts((prev) =>
        prev.map((product) =>
          product._id === id ? { ...product, isVisible: !checked } : product
        )
      );
    } finally {
      setToggleLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return handleToggle;
};
