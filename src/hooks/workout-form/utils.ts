export const generateId = () => Math.random().toString(36).substring(2, 11);

export const processFile = async (file: File) => {
  return { 
    type: file.type.startsWith('video') ? 'video' : 'image', 
    url: file 
  };
};
