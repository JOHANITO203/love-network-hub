import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Bell,
  BellOff,
  Settings,
  Check,
  CheckCheck,
  Heart,
  MessageCircle,
  User,
  Rocket,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter = ({ className }: NotificationCenterProps) => {
  const {
    notifications,
    unreadCount,
    preferences,
    loading,
    permission,
    markAsRead,
    markAllAsRead,
    updatePreferences,
    requestPermission,
    sendTestNotification,
  } = useNotifications();

  const [selectedTab, setSelectedTab] = useState('notifications');

  const getNotificationIcon = (category: string, icon: string) => {
    switch (category) {
      case 'matches':
        return <Heart className="w-4 h-4 text-love-primary" />;
      case 'messages':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'profile':
        return <User className="w-4 h-4 text-green-500" />;
      case 'system':
        return <Rocket className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'matches':
        return 'bg-gradient-to-r from-pink-100 to-red-100 text-pink-700 dark:from-pink-900/30 dark:to-red-900/30 dark:text-pink-400 border border-pink-200 dark:border-pink-800';
      case 'messages':
        return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
      case 'profile':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'system':
        return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead([notification.id]);
    }

    // Handle navigation based on notification type
    if (notification.data?.match_id) {
      // Navigate to matches or specific chat
      window.location.hash = '#matches';
    } else if (notification.data?.message_id) {
      // Navigate to specific chat
      window.location.hash = '#messages';
    }
  };

  const notificationTypes = [
    { id: 'new_match', name: 'Nouveaux Matches', category: 'matches' },
    { id: 'new_message', name: 'Nouveaux Messages', category: 'messages' },
    { id: 'new_like', name: 'Nouveaux Likes', category: 'matches' },
    { id: 'super_like', name: 'Super Likes', category: 'matches' },
    { id: 'profile_view', name: 'Vues de Profil', category: 'profile' },
    { id: 'match_reminder', name: 'Rappels Match', category: 'matches' },
    { id: 'verification_approved', name: 'Vérification Approuvée', category: 'profile' },
    { id: 'system_update', name: 'Mises à jour Système', category: 'system' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative ${className}`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[400px] sm:w-[540px] bg-gradient-to-br from-pink-50/50 via-white to-purple-50/50 dark:from-gray-900/95 dark:via-gray-950/95 dark:to-black/95 backdrop-blur-xl border-l-2 border-pink-200/50 dark:border-pink-900/30">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center shadow-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent font-bold">
              Notifications
            </span>
            {unreadCount > 0 && (
              <Badge className="bg-gradient-to-r from-pink-500 to-red-500 text-white border-0 shadow-md">
                {unreadCount} non lues
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Gérez vos notifications et préférences
          </SheetDescription>
        </SheetHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-1">
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Récentes</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={markAllAsRead}
                    className="text-xs hover:bg-gradient-to-r hover:from-pink-100 hover:to-red-100 dark:hover:from-pink-900/30 dark:hover:to-red-900/30 hover:text-pink-700 dark:hover:text-pink-400 transition-all"
                  >
                    <CheckCheck className="w-3 h-3 mr-1" />
                    Tout marquer lu
                  </Button>
                )}
              </div>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8">
                  <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Aucune notification pour le moment
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                        !notification.is_read
                          ? 'border-pink-300 dark:border-pink-700 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-950/30 dark:to-red-950/30 shadow-md'
                          : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.category, notification.icon)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium line-clamp-1">
                                  {notification.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                              </div>

                              <div className="flex flex-col items-end gap-1">
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg animate-pulse"></div>
                                )}
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${getCategoryColor(notification.category)}`}
                                >
                                  {notification.type_name}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.created_at), {
                                  addSuffix: true,
                                  locale: fr,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <div className="space-y-6">
              {/* Permission Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Notifications Push</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">
                        Statut: {' '}
                        <span
                          className={
                            permission === 'granted'
                              ? 'text-green-600'
                              : permission === 'denied'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }
                        >
                          {permission === 'granted'
                            ? 'Autorisées'
                            : permission === 'denied'
                            ? 'Refusées'
                            : 'En attente'}
                        </span>
                      </p>
                      {permission !== 'granted' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Activez les notifications pour ne rien manquer
                        </p>
                      )}
                    </div>
                    {permission !== 'granted' && (
                      <Button size="sm" onClick={requestPermission}>
                        Activer
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Types de Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notificationTypes.map((type) => {
                      const pref = preferences.find(p => p.notification_type === type.id);
                      return (
                        <div key={type.id} className="flex items-center justify-between">
                          <div>
                            <Label htmlFor={`${type.id}-push`} className="text-sm">
                              {type.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Catégorie: {type.category}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`${type.id}-push`}
                              checked={pref?.push_enabled ?? true}
                              onCheckedChange={(checked) =>
                                updatePreferences(type.id, { push_enabled: checked })
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Test Notification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={sendTestNotification}
                    className="w-full"
                  >
                    Envoyer une notification de test
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};