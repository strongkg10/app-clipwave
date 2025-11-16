'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Star, ThumbsUp, Bug, Lightbulb, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/auth-store';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState<'bug' | 'feature' | 'improvement' | 'other'>('improvement');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('user_feedback').insert({
        user_id: user?.id || 'anonymous',
        page: window.location.pathname,
        rating,
        comment: comment.trim(),
        category,
      });

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setRating(0);
        setComment('');
        setCategory('improvement');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Erro ao enviar feedback. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'from-red-500 to-rose-500' },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'from-yellow-500 to-orange-500' },
    { value: 'improvement', label: 'Improvement', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { value: 'other', label: 'Other', icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-purple-500/50"
        aria-label="Send Feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-white mb-2">Share Your Feedback</h2>
              <p className="text-slate-400">Help us improve VidFlow for you</p>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ThumbsUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                <p className="text-slate-400">Your feedback helps us improve</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-white font-semibold mb-3">How would you rate your experience?</label>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white font-semibold mb-3">Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value as any)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            category === cat.value
                              ? `bg-gradient-to-r ${cat.color} border-transparent text-white`
                              : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-2" />
                          <div className="text-sm font-medium">{cat.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-white font-semibold mb-3">Your Feedback</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you think..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0 || !comment.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Feedback
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
