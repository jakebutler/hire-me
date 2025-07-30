import React, { useState } from 'react';
import { ConvexProvider } from 'convex/react';
import { convex } from '../convex/_generated/api';
import { AuthProvider } from './lib/auth';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { ResumeUpload } from './components/resume/ResumeUpload';
import { ResumeDisplay } from './components/resume/ResumeDisplay';
import { Button } from './components/ui/button';
import { useAuth } from './lib/auth';
import { User, Upload, FileText, LogOut } from 'lucide-react';

function AppContent() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'upload' | 'view'>('upload');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HM</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Hire Me!</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {user?.persona === 'targeted' ? 'Targeted' : 'Volume'}
                </span>
              </div>
              
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setCurrentView('upload')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                currentView === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload Resume
            </button>
            <button
              onClick={() => setCurrentView('view')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                currentView === 'view'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              View Resume
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'upload' ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
              <p className="text-gray-600">
                Upload your PDF resume to get started with AI-powered job search assistance
              </p>
            </div>
            <ResumeUpload onUploadComplete={() => setCurrentView('view')} />
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Master Resume</h2>
              <p className="text-gray-600">
                Review and edit your resume details. This will be used to create job-specific versions.
              </p>
            </div>
            <ResumeDisplay />
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <AuthWrapper>
          <AppContent />
        </AuthWrapper>
      </AuthProvider>
    </ConvexProvider>
  );
}

export default App;