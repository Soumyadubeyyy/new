import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  ok as apiOk,
  badRequest as apiBadRequest,
} from '@/lib/response'; // not used directly but kept for type consistency
import type { Connector, ConnectorStatus, SetupProgress, SetupStep } from '@/db/schema';

/**
 * Hook to manage connector data via the backend API.
 * Provides dashboard data, step completion, disconnect, refresh, and health checks.
 */
export function useConnectors() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch dashboard on mount
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/connectors');
      if (!res.ok) throw new Error('Failed to load connectors');
      const data = await res.json();
      setConnectors(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error loading connectors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Helper to find a connector entry
  const findConnector = useCallback(
    (type: string, env: string) =>
      connectors.find(c => c.connector_type === type && c.environment === env),
    [connectors]
  );

  // Complete a step via API
  const completeStep = useCallback(
    async (
      organizationId: string,
      type: string,
      environment: string,
      stepKey: string,
      payload: Record<string, unknown> = {}
    ) => {
      try {
        const res = await fetch(`/api/connectors/${type}/step`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepKey, environment, payload }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message ?? 'Step completion failed');
        }
        const data = await res.json();
        // Refresh dashboard after step completion
        await fetchDashboard();
        return data;
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Error completing step');
        throw err;
      }
    },
    [fetchDashboard]
  );

  // Disconnect a connector
  const disconnect = useCallback(
    async (type: string, environment: string) => {
      try {
        const res = await fetch(`/api/connectors/${type}/disconnect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ environment }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message ?? 'Disconnect failed');
        }
        await fetchDashboard();
        toast.success(`${type.toUpperCase()} disconnected`);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Error disconnecting');
      }
    },
    [fetchDashboard]
  );

  // Refresh status (simply re-fetch dashboard)
  const refreshStatus = useCallback(async () => {
    await fetchDashboard();
    toast.success('Connector statuses refreshed');
  }, [fetchDashboard]);

  // Health checks per connector type
  const healthCheck = useCallback(
    async (type: string, environment: string) => {
      try {
        const res = await fetch(`/api/connectors/${type}/health?environment=${environment}`);
        if (!res.ok) throw new Error('Health check failed');
        const data = await res.json();
        toast.success(`${type} health: ${data.status}`);
        return data;
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Health check error');
        throw err;
      }
    },
    []
  );

  return {
    connectors,
    loading,
    fetchDashboard,
    findConnector,
    completeStep,
    disconnect,
    refreshStatus,
    healthCheck,
  };
}
