import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { Routes } from '@/constants/routes';
import axios from '@/lib/axios';
import * as S from './styles';
import { Loader } from '../common/Loader';
import { useRouter } from 'next/router';

const Main = () => {
  const router = useRouter();

  const [inputId, setInputId] = useState<string>('');
  const [inputPassword, setInputPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signIn = useCallback(async () => {
    if (inputId.length === 0) {
      alert('아이디를 입력해주세요.');
      return;
    }
    if (inputPassword.length === 0) {
      alert('비밀 번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        '/api/login/',
        { username: inputId, password: inputPassword },
        {
          headers: { 'content-type': 'application/json' },
          withCredentials: true,
        }
      );
      if (!('msg' in response.data && response.data.msg === 'ok')) {
        throw new Error(`${response.status}`);
      }
      router.push(Routes.HOME.route);
    } catch (e) {
      console.error(e);
      alert(`로그인 실패 ㅠㅠ\n(${e})`);
    } finally {
      setIsLoading(false);
    }
  }, [inputId, inputPassword, router]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        '/api/logout/',
        {},
        {
          headers: { 'content-type': 'application/json' },
          withCredentials: true,
        }
      );
      // if (!('msg' in response.data && response.data.msg === 'ok')) {
      //   throw new Error(`${response.status}`);
      // }
      // router.push(Routes.HOME.route);
    } catch (e) {
      alert(`로그인 실패 ㅠㅠ\n(${e})`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <S.MainSection>
      <S.Container>
        <section className="top">
          <div className="login-id">
            아이디
            <input
              type="text"
              value={inputId}
              onChange={(e) => {
                setInputId(e.currentTarget.value);
              }}
            />
          </div>
          <div className="login-password">
            비밀 번호
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.currentTarget.value);
              }}
            />
          </div>
        </section>
        <section className="bottom">
          <Button onClick={signIn}>{isLoading ? <Loader /> : '로그인'}</Button>
          <Button onClick={signOut}>로그아웃</Button>
        </section>
      </S.Container>
    </S.MainSection>
  );
};

export default Main;