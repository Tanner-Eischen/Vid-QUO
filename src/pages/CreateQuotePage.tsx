import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreateQuotePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/create-quote/basic', { replace: true });
  }, [navigate]);

  return null;
};
