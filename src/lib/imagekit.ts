import ImageKit from 'imagekit';

let imagekitInstance: ImageKit | null = null;

export function getImageKit() {
  if (!imagekitInstance) {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || 'mock_pub_key';
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'mock_priv_key';
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/mock';

    imagekitInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  }
  return imagekitInstance;
}

export default getImageKit();
