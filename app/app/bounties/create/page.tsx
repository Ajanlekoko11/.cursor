'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CreateBountyPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenType, setTokenType] = useState<'SOL' | 'USDC'>('SOL');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Upload files to IPFS first (if any)
      const attachments: Array<{ ipfsHash: string; filename: string; size: number }> = [];
      
      if (files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || `Failed to upload ${file.name}`);
          }

          const uploadData = await uploadResponse.json();
          attachments.push({
            ipfsHash: uploadData.ipfsHash,
            filename: file.name,
            size: file.size,
          });
        }
      }

      // Create bounty with attachments
      const response = await fetch('/api/bounties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          amount: parseFloat(amount),
          tokenType,
          attachments: attachments.length > 0 ? attachments : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create bounty');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/app/bounties`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[#F8FAFC] mb-2">Create Bounty</h1>
        <p className="text-[#94A3B8]">Create a new bounty and fund it with SOL or USDC</p>
      </div>

      {error && (
        <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
          {error}
        </Alert>
      )}

      {success && (
        <Alert className="bg-[#00FFB3]/10 border-[#00FFB3]/20 text-[#00FFB3]">
          Bounty created successfully! Redirecting...
        </Alert>
      )}

      <Card className="bg-[#1E293B] border-[#334155] p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#F8FAFC]">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
              placeholder="e.g., Expose corporate fraud"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#F8FAFC]">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className="bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
              placeholder="Describe what information you're looking for..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[#F8FAFC]">
                Reward Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokenType" className="text-[#F8FAFC]">
                Token Type
              </Label>
              <Select value={tokenType} onValueChange={(value: 'SOL' | 'USDC') => setTokenType(value)}>
                <SelectTrigger className="bg-[#0F172A] border-[#334155] text-[#F8FAFC]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-[#334155]">
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="files" className="text-[#F8FAFC]">
              Attachments (Optional)
            </Label>
            <Input
              id="files"
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
            />
            <p className="text-xs text-[#94A3B8]">
              You can upload images, documents, or other files. Files will be encrypted and stored on IPFS.
            </p>
            
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-[#F8FAFC]">Selected files:</p>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#0F172A] border border-[#334155] rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {file.type.startsWith('image/') && (
                          <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-[#1E293B]">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#F8FAFC] truncate">{file.name}</p>
                          <p className="text-xs text-[#94A3B8]">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 border-[#334155] text-[#F8FAFC] hover:bg-[#334155]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || success}
              className="flex-1 bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3]"
            >
              {loading ? 'Creating...' : success ? 'Created!' : 'Create Bounty'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

