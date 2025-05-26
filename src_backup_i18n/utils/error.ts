export const handleError = (error: any) => {
  console.error(error);
  console.error(error.response?.data?.message || '操作失败，请重试');
}; 