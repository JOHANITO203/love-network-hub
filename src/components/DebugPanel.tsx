import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

export const DebugPanel = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [autoExportEnabled, setAutoExportEnabled] = useState(true);

  const addLog = useCallback((message: string) => {
    const newLog = `${new Date().toLocaleTimeString()}: ${message}`;
    setLogs(prev => {
      const newLogs = [...prev.slice(-50), newLog]; // Garder 50 logs au lieu de 10

      // Auto-export vers la console
      if (autoExportEnabled) {
        console.log('[DEBUG EXPORT]', newLog);
      }

      return newLogs;
    });
  }, [autoExportEnabled]);

  // Exposer la fonction globalement pour les tests
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.addDebugLog = addLog;

    return () => {
      if (window.addDebugLog === addLog) {
        delete window.addDebugLog;
      }
    };
  }, [addLog]);

  if (!isVisible) {
    return (
      <div
        className="fixed bottom-4 right-4 z-50 bg-red-500 text-white p-3 rounded cursor-pointer"
        onClick={() => setIsVisible(true)}
      >
        🔍 Debug Panel
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">🔍 Debug Logs</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-red-500 hover:text-red-700"
          aria-label="Fermer le panneau de debug"
        >
          ×
        </button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
        {logs.length === 0 ? (
          <p className="text-gray-500">Aucun log - testez les fonctions</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded text-xs">
              {log}
            </div>
          ))
        )}
      </div>

      <div className="mt-3 space-y-2">
        <Button
          onClick={() => addLog('Test: Panel fonctionne!')}
          size="sm"
          className="w-full text-xs"
        >
          Test Panel
        </Button>
        <Button
          onClick={() => setAutoExportEnabled(prev => !prev)}
          size="sm"
          variant="outline"
          className="w-full text-xs"
        >
          {autoExportEnabled ? 'Désactiver auto-export' : 'Activer auto-export'}
        </Button>
        <Button
          onClick={() => {
            const allLogs = logs.join('\n');
            navigator.clipboard?.writeText(allLogs)
              .then(() => addLog('Logs copiés dans le presse-papier'))
              .catch(() => addLog('Impossible de copier les logs'));
          }}
          size="sm"
          variant="outline"
          className="w-full text-xs"
        >
          Copier Logs
        </Button>
        <Button
          onClick={() => {
            console.log('=== EXPORT COMPLET DES LOGS ===');
            logs.forEach(log => console.log(log));
            console.log('=== FIN EXPORT ===');
            addLog('Logs exportés dans Console (F12)');
          }}
          size="sm"
          variant="outline"
          className="w-full text-xs"
        >
          Export Console
        </Button>
        <Button
          onClick={() => setLogs([])}
          size="sm"
          variant="outline"
          className="w-full text-xs"
        >
          Vider logs
        </Button>
      </div>
    </div>
  );
};
