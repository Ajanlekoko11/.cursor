'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';

export default function SubmitTipPage() {
  const router = useRouter();
  const [bountyId, setBountyId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!bountyId || !file) {
      setError('Please select a bounty and upload a file');
      return;
    }

    setLoading(true);

    try {
      // Upload file to IPFS
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const uploadData = await uploadResponse.json();

      // Submit tip
      const tipResponse = await fetch('/api/tips/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bountyId,
          ipfsHash: uploadData.ipfsHash,
          description,
        }),
      });

      if (!tipResponse.ok) {
        const errorData = await tipResponse.json();
        throw new Error(errorData.error || 'Failed to submit tip');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/app/bounties');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[#F8FAFC] mb-2">Submit Anonymous Tip</h1>
        <p className="text-[#94A3B8]">
          Upload encrypted evidence. Your identity stays completely anonymous.
        </p>
      </div>

      <Card className="bg-[#1E293B] border-[#334155] p-6">
        {success && (
          <Alert className="bg-[#00FFB3]/10 border-[#00FFB3] text-[#00FFB3] mb-4">
            Tip submitted successfully! Redirecting...
          </Alert>
        )}

        {error && (
          <Alert className="bg-red-500/10 border-red-500/20 text-red-400 mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="bountyId" className="text-sm font-medium text-[#F8FAFC]">
              Select Bounty
            </label>
            <Input
              id="bountyId"
              value={bountyId}
              onChange={(e) => setBountyId(e.target.value)}
              required
              className="bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
              placeholder="Bounty ID"
            />
            <p className="text-xs text-[#94A3B8]">
              Find the bounty ID from the bounties page
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-[#F8FAFC]">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
              placeholder="Additional context about your tip..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium text-[#F8FAFC]">
              Upload File
            </label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              required
              className="bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
            />
            <p className="text-xs text-[#94A3B8]">
              File will be encrypted before upload to IPFS
            </p>
            {file && (
              <p className="text-sm text-[#00FFB3] mt-2">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-[#F8FAFC]">Security Notice</p>
            <ul className="text-xs text-[#94A3B8] space-y-1 list-disc list-inside">
              <li>Your file will be encrypted before upload</li>
              <li>Only you and verified admins can decrypt it</li>
              <li>Your identity remains completely anonymous</li>
              <li>IPFS hash is stored on-chain for permanence</li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3] font-semibold"
          >
            {loading ? 'Submitting...' : success ? 'Submitted!' : 'Submit Tip'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

