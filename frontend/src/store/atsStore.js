import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const useATSStore = create(
  persist(
    (set, get) => ({
      reports: [],
      currentReport: null,
      isAnalyzing: false,
      progress: 0,
      error: null,

      // Get auth token from localStorage
      getAuthToken: () => {
        try {
          const authStorage = localStorage.getItem('auth-storage');
          if (authStorage) {
            const parsed = JSON.parse(authStorage);
            return parsed.state?.token;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        return null;
      },

      // Analyze resume against job description
      analyzeResume: async (resumeFile, jobDescription) => {
        set({ isAnalyzing: true, progress: 0, error: null });

        try {
          const token = get().getAuthToken();
          if (!token) {
            throw new Error('Authentication required');
          }

          // Step 1: Upload file to Cloudinary and extract text
          set({ progress: 10 });
          const formData = new FormData();
          formData.append('file', resumeFile);

          const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            console.error('❌ Upload failed:', errorData);
            throw new Error(errorData.message || 'File upload failed');
          }

          const uploadData = await uploadResponse.json();
          console.log('📤 Upload response:', uploadData);
          set({ progress: 40 });

          // Step 2: Analyze resume using the uploaded file data
          const analysisPayload = {
            jobDescription,
            fileId: uploadData.data.fileId,
            fileName: uploadData.data.originalName,
            extractedText: uploadData.data.extractedText,
            cloudinaryPublicId: uploadData.data.cloudinaryPublicId,
            cloudinaryUrl: uploadData.data.cloudinaryUrl,
            fileSize: uploadData.data.fileSize,
            fileType: uploadData.data.fileType
          };
          
          console.log('📊 Analysis payload:', analysisPayload);
          
          const analysisResponse = await fetch(`${API_BASE_URL}/ats/analyze`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(analysisPayload)
          });

          set({ progress: 80 });

          if (!analysisResponse.ok) {
            const errorData = await analysisResponse.json();
            console.error('❌ Analysis failed:', errorData);
            throw new Error(errorData.errors || errorData.message || 'Analysis failed');
          }

          const analysisData = await analysisResponse.json();
          set({ progress: 100 });

          // Format report data to match frontend expectations
          const report = {
            id: analysisData.data.reportId || analysisData.data._id,
            fileName: uploadData.data.originalName,
            score: analysisData.data.score,
            analyzedAt: analysisData.data.analyzedAt || new Date().toISOString(),
            matchedSkills: analysisData.data.analysis?.matchedSkills || [],
            missingSkills: analysisData.data.analysis?.missingSkills || [],
            suggestions: analysisData.data.analysis?.suggestions || [],
            sections: analysisData.data.analysis?.sections || {},
            jobDescription: jobDescription.substring(0, 200) + '...',
            processingTime: analysisData.data.processingTime,
            insights: analysisData.data.insights || [],
            improvementPotential: analysisData.data.improvementPotential || 0
          };

          // Add to reports and set as current
          const reports = [...get().reports, report];
          set({
            reports,
            currentReport: report,
            isAnalyzing: false,
            progress: 0
          });

          return report;

        } catch (error) {
          console.error('Analysis error:', error);
          set({
            isAnalyzing: false,
            progress: 0,
            error: error.message || 'Analysis failed'
          });
          throw error;
        }
      },

      // Load reports from backend
      loadReports: async () => {
        try {
          const token = get().getAuthToken();
          if (!token) {
            throw new Error('Authentication required');
          }

          const response = await fetch(`${API_BASE_URL}/ats/reports`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to load reports');
          }

          const data = await response.json();
          
          // Format reports to match frontend expectations
          const formattedReports = data.data.reports.map(report => ({
            id: report._id,
            fileName: report.fileName,
            score: report.score,
            analyzedAt: report.createdAt,
            matchedSkills: report.analysis?.matchedSkills?.map(s => s.skill) || [],
            missingSkills: report.analysis?.missingSkills?.map(s => s.skill) || [],
            suggestions: report.analysis?.suggestions?.map(s => s.suggestion) || [],
            sections: report.analysis?.sections || {},
            jobDescription: report.jobDescription ? report.jobDescription.substring(0, 200) + '...' : '',
            processingTime: report.processingTime || 0
          }));

          set({ reports: formattedReports });
          return formattedReports;

        } catch (error) {
          console.error('Load reports error:', error);
          set({ error: error.message });
          throw error;
        }
      },

      // Get statistics from backend
      loadStats: async () => {
        try {
          const token = get().getAuthToken();
          if (!token) {
            throw new Error('Authentication required');
          }

          const response = await fetch(`${API_BASE_URL}/ats/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to load statistics');
          }

          const data = await response.json();
          return data.data;

        } catch (error) {
          console.error('Load stats error:', error);
          set({ error: error.message });
          throw error;
        }
      },

      // Get report by ID (always fetch fresh from backend to avoid cache corruption)
      getReport: async (reportId) => {
        try {
          console.log('🔍 Always fetching fresh report from backend for ID:', reportId);
          const token = get().getAuthToken();
          if (!token) {
            throw new Error('Authentication required');
          }

          // Add timestamp to URL to bypass browser cache
          const timestampedUrl = `${API_BASE_URL}/ats/reports/${reportId}?t=${Date.now()}`;
          
          const response = await fetch(timestampedUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Report not found');
          }

          const data = await response.json();
          const report = data.data.report;

          // Debug job description from backend
          console.log('🔍 Backend Report Job Description:', {
            rawValue: report.jobDescription,
            type: typeof report.jobDescription,
            length: report.jobDescription?.length,
            preview: report.jobDescription?.substring(0, 100),
            isUndefined: report.jobDescription === undefined,
            isNull: report.jobDescription === null,
            isEmpty: report.jobDescription === '',
            startsWithUndefined: String(report.jobDescription).startsWith('undefined')
          });

          // Format report with careful job description handling
          const formattedReport = {
            id: report._id,
            fileName: report.fileName,
            score: report.score,
            analyzedAt: report.createdAt,
            matchedSkills: report.analysis?.matchedSkills?.map(s => s.skill) || [],
            missingSkills: report.analysis?.missingSkills?.map(s => s.skill) || [],
            suggestions: report.analysis?.suggestions?.map(s => s.suggestion) || [],
            sections: report.analysis?.sections || {},
            // Ensure we never get "undefined..." - handle all edge cases
            jobDescription: (report.jobDescription && 
                           report.jobDescription !== 'undefined' && 
                           !String(report.jobDescription).startsWith('undefined')) 
                           ? report.jobDescription 
                           : '',
            processingTime: report.processingTime || 0,
            insights: report.insights || [],
            improvementPotential: report.improvementPotential || 0
          };

          console.log('🔍 Final Formatted Job Description:', {
            value: formattedReport.jobDescription,
            type: typeof formattedReport.jobDescription,
            length: formattedReport.jobDescription?.length,
            preview: formattedReport.jobDescription?.substring(0, 100)
          });

          // Clear any corrupted cache and update with fresh data
          const currentReports = get().reports.filter(r => r.id !== reportId);
          currentReports.push(formattedReport);
          set({ reports: currentReports });

          return formattedReport;

        } catch (error) {
          console.error('Get report error:', error);
          throw error;
        }
      },

      // Delete report
      deleteReport: async (reportId) => {
        try {
          const token = get().getAuthToken();
          if (!token) {
            throw new Error('Authentication required');
          }

          const response = await fetch(`${API_BASE_URL}/ats/reports/${reportId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete report');
          }

          // Remove from local state
          const reports = get().reports.filter(report => report.id !== reportId);
          set({ reports });

        } catch (error) {
          console.error('Delete report error:', error);
          set({ error: error.message });
          throw error;
        }
      },

      // Clear current report
      clearCurrentReport: () => set({ currentReport: null }),

      // Clear error
      clearError: () => set({ error: null }),

      // Get statistics (local calculation for backward compatibility)
      getStats: () => {
        const reports = get().reports;
        if (reports.length === 0) return null;

        const scores = reports.map(r => r.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);

        return {
          totalReports: reports.length,
          averageScore: Math.round(avgScore),
          highestScore: maxScore,
          lowestScore: minScore,
          recentReports: reports.slice(-5).reverse()
        };
      },

      // Clear corrupted cache data and localStorage
      clearCorruptedCache: () => {
        try {
          // Clear localStorage completely for ATS storage
          localStorage.removeItem('ats-storage');
          console.log('🔍 Cleared localStorage ats-storage');
          
          // Clear zustand state
          set({ reports: [] });
          console.log('🔍 Cleared zustand reports state');
        } catch (error) {
          console.error('Error clearing corrupted cache:', error);
        }
      }
    }),
    {
      name: 'ats-storage',
      partialize: (state) => ({
        reports: state.reports,
      }),
    }
  )
);

export default useATSStore;