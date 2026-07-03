/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Upload, 
  Trash2, 
  Play, 
  X, 
  FileVideo, 
  Calendar, 
  Database, 
  Info, 
  Film,
  Lock,
  Edit3,
  Check,
  ChevronDown
} from 'lucide-react';
import { StoredVideo, getAllVideos, saveVideo, deleteVideo } from '../lib/videoStorage';

interface VideoLecturesViewProps {
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  isAdmin?: boolean;
  activeVideo?: StoredVideo | null;
  activeVideoUrl?: string;
  onPlayVideo?: (video: StoredVideo, url: string) => void;
  onCloseVideo?: () => void;
}

export default function VideoLecturesView({ 
  approvalStatus = 'approved', 
  isAdmin = false,
  activeVideo: propActiveVideo,
  activeVideoUrl: propActiveVideoUrl,
  onPlayVideo,
  onCloseVideo
}: VideoLecturesViewProps) {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [localActiveVideo, setLocalActiveVideo] = useState<StoredVideo | null>(null);
  const [localActiveVideoUrl, setLocalActiveVideoUrl] = useState<string>('');
  
  const activeVideo = propActiveVideo !== undefined ? propActiveVideo : localActiveVideo;
  const activeVideoUrl = propActiveVideoUrl !== undefined ? propActiveVideoUrl : localActiveVideoUrl;

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [customVideoName, setCustomVideoName] = useState<string>('');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [renamingVideoId, setRenamingVideoId] = useState<string | null>(null);
  const [renamingVideoValue, setRenamingVideoValue] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load videos on mount
  useEffect(() => {
    loadVideosFromStorage();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clean up Object URL when active video changes or unmounts
  useEffect(() => {
    return () => {
      if (activeVideoUrl) {
        URL.revokeObjectURL(activeVideoUrl);
      }
    };
  }, [activeVideoUrl]);

  const loadVideosFromStorage = async () => {
    try {
      const stored = await getAllVideos();
      // Sort by creation date (newest first)
      const sorted = stored.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setVideos(sorted);
    } catch (err) {
      console.error('Failed to load videos:', err);
      showToast('Error loading saved videos. Please try again.', 'error');
    }
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      showToast('Kripya sirf valid video files (.mp4, .webm, .ogg) hi select karein, beta!', 'error');
      return;
    }
    // Clean up filename by removing common extensions
    const cleanName = file.name.replace(/\.[^/.]+$/, "");
    setPendingFile(file);
    setCustomVideoName(cleanName);
  };

  const handleSaveWithCustomName = async () => {
    if (!pendingFile) return;
    if (!customVideoName.trim()) {
      showToast('Kripya video ka ek name zaroor set karein, beta!', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const reader = new FileReader();
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 90);
          setUploadProgress(10 + percent);
        }
      };

      reader.onload = async () => {
        try {
          const videoData: StoredVideo = {
            id: 'video_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: customVideoName.trim(),
            size: pendingFile.size,
            type: pendingFile.type,
            blob: pendingFile,
            createdAt: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          };

          await saveVideo(videoData);
          setUploadProgress(100);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            setPendingFile(null);
            setCustomVideoName('');
            showToast('Video safaltapoorvak save ho gaya hai beta! 🎉', 'success');
            loadVideosFromStorage();
          }, 500);
        } catch (dbErr) {
          console.error(dbErr);
          setIsUploading(false);
          showToast('Browser storage me video save nahi ho paya. Storage check karein.', 'error');
        }
      };

      reader.onerror = () => {
        setIsUploading(false);
        showToast('Video file read karne me problem aayi.', 'error');
      };

      reader.readAsArrayBuffer(pendingFile);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      showToast('Kuch gadbad ho gayi beta. Kripya firse koshish karein.', 'error');
    }
  };

  const handlePlayVideo = (video: StoredVideo) => {
    if (activeVideoUrl && propActiveVideoUrl === undefined) {
      URL.revokeObjectURL(activeVideoUrl);
    }
    const url = URL.createObjectURL(video.blob);
    if (onPlayVideo) {
      onPlayVideo(video, url);
    } else {
      setLocalActiveVideo(video);
      setLocalActiveVideoUrl(url);
    }
    
    // Scroll to the video player
    setTimeout(() => {
      document.getElementById('video-theatre-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClosePlayer = () => {
    if (onCloseVideo) {
      onCloseVideo();
    } else {
      setLocalActiveVideo(null);
      if (localActiveVideoUrl) {
        URL.revokeObjectURL(localActiveVideoUrl);
        setLocalActiveVideoUrl('');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      if (activeVideo && activeVideo.id === deleteTargetId) {
        handleClosePlayer();
      }
      await deleteVideo(deleteTargetId);
      setDeleteTargetId(null);
      showToast('Video delete kar diya gaya hai. 🗑️', 'success');
      loadVideosFromStorage();
    } catch (err) {
      console.error(err);
      showToast('Video delete nahi ho paya. Koshish karein.', 'error');
    }
  };

  const handleRenameVideo = async (id: string) => {
    if (!renamingVideoValue.trim()) {
      showToast('Video ka name khali nahi ho sakta, beta!', 'error');
      return;
    }
    const targetVideo = videos.find(v => v.id === id);
    if (!targetVideo) return;

    try {
      const updatedVideo: StoredVideo = {
        ...targetVideo,
        name: renamingVideoValue.trim()
      };
      await saveVideo(updatedVideo);
      setRenamingVideoId(null);
      setRenamingVideoValue('');
      showToast('Video name updated successfully! ✏️', 'success');
      await loadVideosFromStorage();

      if (activeVideo && activeVideo.id === id) {
        if (onPlayVideo) {
          onPlayVideo(updatedVideo, activeVideoUrl);
        } else {
          setLocalActiveVideo(updatedVideo);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Name update karne me problem aayi, beta.', 'error');
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const isApproved = approvalStatus === 'approved';

  if (!isApproved) {
    return (
      <div className="bg-white rounded-3xl border border-rose-100 shadow-xl p-8 text-center max-w-2xl mx-auto space-y-6 my-4 animate-fadeIn text-left">
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mx-auto shadow-sm">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-3 text-center">
          <span className="bg-rose-50 text-rose-700 border border-rose-100 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
            Access Restricted 🔒
          </span>
          <h3 className="font-display font-black text-slate-800 text-lg sm:text-xl">
            Video Lectures Locked 🎥
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto font-sans">
            "Beta, is video module ko chalane ke liye aapka account approved hona chahiye. Pawan Sir ke approval ke baad aap classes videos dekh aur store kar sakenge!"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          id="toast-notification"
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 z-50 animate-bounce duration-300 ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}
        >
          <span>{toastMessage.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Dropdown Selection Box / वीडियो लेक्चर चयन */}
      <div ref={dropdownRef} className="relative z-30 max-w-xl mx-auto text-left">
        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
          Select Lecture Video / क्लास वीडियो चुनें 🎥
        </label>
        <div className="relative">
          <button
            id="video-selector-dropdown-trigger"
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl px-4 py-3.5 text-left font-bold text-slate-800 text-xs sm:text-sm flex items-center justify-between shadow-sm cursor-pointer transition-all duration-300"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <FileVideo className="w-4 h-4" />
              </span>
              <span className="truncate">
                {activeVideo ? activeVideo.name : 'Choose a Video Lecture to Play / कोई वीडियो चुनें...'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-40 max-h-72 flex flex-col animate-fadeIn">
              <div className="p-2 border-b border-slate-100 bg-slate-50">
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider px-2 py-1">
                  All Stored Lectures / कुल वीडियो ({videos.length})
                </p>
              </div>
              <div className="overflow-y-auto divide-y divide-slate-50">
                {videos.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-400 font-bold">
                    Koi video saved nahi hai beta.
                  </div>
                ) : (
                  videos.map((vid) => {
                    const isActive = activeVideo?.id === vid.id;
                    return (
                      <button
                        key={vid.id}
                        type="button"
                        onClick={() => {
                          handlePlayVideo(vid);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isActive ? 'bg-indigo-50/40 font-black' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Play className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-600 fill-indigo-100 animate-pulse' : 'text-slate-400'}`} />
                          <div className="min-w-0">
                            <p className={`text-xs text-slate-800 truncate ${isActive ? 'text-indigo-600 font-extrabold' : 'font-bold'}`}>
                              {vid.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              {vid.createdAt} • {formatSize(vid.size)}
                            </p>
                          </div>
                        </div>
                        {isActive && (
                          <span className="text-[9px] font-black uppercase bg-indigo-600 text-white px-1.5 py-0.5 rounded-md shrink-0">Playing</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Theatre Player Section */}
      {activeVideo && (
        <div 
          id="video-theatre-player" 
          className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl text-left space-y-4 animate-fadeIn"
        >
          {/* Theatre Header */}
          <div className="px-5 py-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Film className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-black tracking-widest text-indigo-400">Now Playing / अभी चल रहा है</p>
                <h3 className="font-bold text-slate-200 text-xs sm:text-sm truncate">{activeVideo.name}</h3>
              </div>
            </div>
            <button
              id="close-theatre-player-btn"
              onClick={handleClosePlayer}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-all cursor-pointer"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Video element container */}
          <div className="aspect-video bg-black relative flex items-center justify-center">
            <video 
              id="html5-video-player-frame"
              src={activeVideoUrl} 
              controls 
              autoPlay
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Video info bar */}
          <div className="p-5 space-y-3 bg-slate-950/40 border-t border-slate-850">
            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Uploaded: {activeVideo.createdAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>File Size: {formatSize(activeVideo.size)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Drag & Drop Box */}
      {isAdmin && (
        <div 
          id="video-dropzone-box"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`bg-white rounded-3xl border border-dashed p-8 text-center transition-all duration-300 relative flex flex-col items-center justify-center gap-4 ${
            isDragging 
              ? 'border-indigo-600 bg-indigo-50/20 scale-[1.01]' 
              : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/40'
          }`}
        >
          <input 
            type="file" 
            id="lecture-video-uploader-input" 
            ref={fileInputRef}
            accept="video/*" 
            className="hidden" 
            onChange={handleFileSelect}
          />

          {pendingFile ? (
            <div className="w-full max-w-md bg-slate-50 border border-slate-150 rounded-2xl p-5 text-left space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Film className="w-5 h-5 animate-pulse" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Selected Video File</p>
                  <p className="text-xs font-bold text-slate-700 truncate">{pendingFile.name}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider">
                  Video Name / वीडियो का नाम set karein:
                </label>
                <input
                  type="text"
                  placeholder="E.g. Python Lecture 1: Basics of Variables"
                  value={customVideoName}
                  onChange={(e) => setCustomVideoName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              {isUploading ? (
                <div className="w-full space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-black text-indigo-600">
                    <span>Storing in offline storage / सेव हो रहा है...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }} 
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingFile(null);
                      setCustomVideoName('');
                    }}
                    className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-extrabold rounded-xl text-xs transition-all cursor-pointer text-center"
                  >
                    Cancel ❌
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveWithCustomName}
                    className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/15 text-white font-extrabold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Save 🎥</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                <Upload className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-1 max-w-md">
                <h4 className="font-display font-black text-slate-800 text-sm sm:text-base">
                  Upload Lecture Video 🎥 (वीडियो अपलोड करें)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Apne mobile ya computer se koi bhi video lecture select karein. Yeh aapke hi browser/device me <strong className="text-indigo-600">securely store</strong> rahega!
                </p>
              </div>

              <button
                id="trigger-file-select-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-black hover:shadow-lg hover:shadow-indigo-600/15 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Choose Video File
              </button>
            </>
          )}
        </div>
      )}

      {/* Admin Management Section - ONLY visible if admin */}
      {isAdmin && (
        <div className="space-y-4 text-left border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Database className="w-4 h-4" />
              </span>
              <h3 className="font-display font-black text-slate-800 text-sm sm:text-base">
                Manage Stored Lectures / वीडियो मैनेजमेंट ({videos.length})
              </h3>
            </div>
          </div>

          {videos.length === 0 ? (
            <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-8 text-center text-xs text-slate-400 font-bold">
              No videos uploaded yet. Use the upload area above to add your lectures!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videos.map((vid) => {
                const isActive = activeVideo?.id === vid.id;
                const isRenaming = renamingVideoId === vid.id;
                return (
                  <div 
                    key={vid.id}
                    className={`bg-white rounded-2xl border p-4.5 transition-all flex flex-col justify-between gap-4 relative overflow-hidden group ${
                      isActive 
                        ? 'border-indigo-500 ring-2 ring-indigo-500/10' 
                        : 'border-slate-100 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div 
                        onClick={() => handlePlayVideo(vid)}
                        className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center shrink-0 text-indigo-500 relative cursor-pointer group-hover:bg-indigo-50/50 transition-all"
                      >
                        <Play className="w-4 h-4 group-hover:scale-125 transition-all fill-indigo-50" />
                        {isActive && (
                          <div className="absolute inset-0 bg-indigo-600/10 rounded-xl flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1 text-left">
                        {isRenaming ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={renamingVideoValue}
                              onChange={(e) => setRenamingVideoValue(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-white border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                              placeholder="Set new video name"
                              autoFocus
                            />
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleRenameVideo(vid.id)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <Check className="w-3 h-3" /> Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRenamingVideoId(null);
                                  setRenamingVideoValue('');
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black rounded-lg cursor-pointer transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h4 
                              className="font-bold text-slate-800 text-xs sm:text-sm truncate cursor-pointer hover:text-indigo-600 transition-all"
                              onClick={() => handlePlayVideo(vid)}
                              title={vid.name}
                            >
                              {vid.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                              <span>{formatSize(vid.size)}</span>
                              <span>•</span>
                              <span>{vid.createdAt}</span>
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => handlePlayVideo(vid)}
                        className="flex items-center gap-1 text-[11px] font-black text-indigo-600 hover:text-indigo-700 transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-indigo-50" />
                        Play Video
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRenamingVideoId(vid.id);
                            setRenamingVideoValue(vid.name);
                          }}
                          className="flex items-center gap-1 text-[11px] font-black text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/50 px-2 py-1 rounded-lg transition-all cursor-pointer"
                          title="Rename Video"
                        >
                          <Edit3 className="w-3 h-3" />
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(vid.id)}
                          className="flex items-center gap-1 text-[11px] font-black text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 px-2 py-1 rounded-lg transition-all cursor-pointer"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {isActive && (
                      <span className="absolute top-2 right-2 text-[8px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        Playing
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div 
          id="delete-video-confirmation-modal"
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-scaleUp">
            <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mx-auto shadow-sm">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-black text-slate-800 text-sm sm:text-base">
                Delete Video? 🗑️
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Beta, kya aap such-much is lecture video ko delete karna chahte hain? Ek baar delete karne par ye permanent chala jayega.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                id="cancel-delete-video-btn"
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-600 font-extrabold rounded-xl text-xs transition-all cursor-pointer border border-slate-200/50"
              >
                Nahi, Cancel!
              </button>
              <button
                id="confirm-delete-video-btn"
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-rose-600/10 cursor-pointer"
              >
                Haan, Delete 🗑️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
