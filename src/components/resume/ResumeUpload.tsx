import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/auth';
import { Button } from '../ui/button';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { parseResumePDF } from '../../lib/resumeParser';

interface ResumeUploadProps {
  onUploadComplete?: () => void;
}

export function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'parsing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const uploadResume = useMutation(api.resumes.uploadResume);

  const parseAndUploadFile = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    setUploadStatus('uploading');
    setError(null);

    try {
      // First, upload the file to Convex storage
      const storageResponse = await fetch('/api/upload', {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!storageResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const { storageId } = await storageResponse.json();

      setUploadStatus('parsing');

      // Parse the PDF content
      const { parsedText, structured } = await parseResumePDF(file);

      // Save resume to database with parsed data
      await uploadResume({
        userId: user._id,
        fileName: file.name,
        fileStorageId: storageId,
        parsedText,
        structured,
        isMaster: true, // First resume is automatically master
      });

      setUploadStatus('success');
      onUploadComplete?.();

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload and parse resume');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      parseAndUploadFile(file);
    }
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const getStatusContent = () => {
    switch (uploadStatus) {
      case 'uploading':
        return (
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Uploading your resume...</p>
          </div>
        );
      case 'parsing':
        return (
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Analyzing and parsing your resume...</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-green-600 font-medium">Resume uploaded successfully!</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setUploadStatus('idle')}
            >
              Try Again
            </Button>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop your PDF resume, or click to browse
            </p>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        <input {...getInputProps()} />
        {getStatusContent()}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Only PDF files are supported. Max file size: 10MB
        </p>
      </div>
    </div>
  );
}