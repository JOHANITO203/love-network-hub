import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DatingApp } from "@/components/DatingApp";

const Index = () => {
  const { user, loading } = useAuth();
  const intl = useIntl();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{intl.formatMessage({ id: 'app.loading' })}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <DatingApp />;
};

export default Index;
