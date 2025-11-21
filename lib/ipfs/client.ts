import { NFTStorage, File } from 'nft.storage';

const API_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY;

if (!API_KEY) {
  console.warn('NFT.Storage API key not found. IPFS uploads will not work.');
}

export const nftStorage = API_KEY ? new NFTStorage({ token: API_KEY }) : null;

export async function uploadToIPFS(file: File | Blob, filename?: string): Promise<string> {
  if (!nftStorage) {
    throw new Error('NFT.Storage client not initialized. Please set NEXT_PUBLIC_NFT_STORAGE_API_KEY');
  }

  try {
    const nftFile = file instanceof File ? file : new File([file], filename || 'file', { type: file.type });
    const cid = await nftStorage.storeBlob(nftFile);
    return cid;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

export async function uploadEncryptedToIPFS(encryptedData: Uint8Array, filename: string = 'encrypted'): Promise<string> {
  if (!nftStorage) {
    throw new Error('NFT.Storage client not initialized');
  }

  try {
    const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
    const file = new File([blob], filename, { type: 'application/octet-stream' });
    const cid = await nftStorage.storeBlob(file);
    return cid;
  } catch (error) {
    console.error('Error uploading encrypted data to IPFS:', error);
    throw new Error('Failed to upload encrypted data to IPFS');
  }
}

export function getIPFSGatewayUrl(cid: string): string {
  return `https://${cid}.ipfs.nftstorage.link`;
}

