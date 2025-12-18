import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card } from './ui';

export const LoginForm: React.FC = () => {
  const { signIn, signUp, signInWithKakao, loading, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      if (isSignUp) {
        await signUp({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });
        alert('회원가입 요청이 제출되었습니다. 관리자 승인을 기다려주세요.');
        setIsSignUp(false);
        setFormData({ email: '', password: '', confirmPassword: '' });
      } else {
        await signIn({
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (error) {
      console.error('인증 오류:', error);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? '회원가입' : '로그인'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-1"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {isSignUp && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호 확인
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="mt-1"
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
          </Button>
        </form>

        {/* 소셜 로그인 구분선 */}
        <div className="mt-6 mb-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">또는</span>
            </div>
          </div>
        </div>

        {/* 카카오 로그인 버튼 */}
        <Button
          onClick={handleKakaoLogin}
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium"
        >
          <span className="mr-2">💬</span>
          카카오로 로그인
        </Button>

        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-500"
          >
            {isSignUp
              ? '이미 계정이 있으신가요? 로그인'
              : '계정이 없으신가요? 회원가입'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
