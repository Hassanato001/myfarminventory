import { useState } from 'react';
import Input from '../components/common/Input.jsx';
import Table from '../components/common/Table.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { useAuditData } from '../hooks/useAuditData.js';
import { formatDate } from '../utils/helpers.js';

function AuditLog() {
  const [refreshToken, setRefreshToken] = useState(0);
  const [search, setSearch] = useState('');
  const { logs, loading } = useAuditData(refreshToken, search);

  return (
    <div className="page">
      <h1 className="page-title">Audit Log</h1>
      <div className="card-grid">
        <div className="panel">
          <Input label="Search audit trail" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="panel">
          <button className="btn" onClick={() => setRefreshToken((value) => value + 1)}>Refresh</button>
        </div>
      </div>
      {loading ? (
        <div className="panel">
          <Spinner />
        </div>
      ) : (
        <Table
          columns={[
            { key: 'action', label: 'Action' },
            { key: 'entity', label: 'Entity' },
            { key: 'entityId', label: 'Entity ID' },
            { key: 'createdAt', label: 'Date' }
          ]}
          rows={logs.map((log) => ({
            id: log.id,
            action: log.action,
            entity: log.entity,
            entityId: log.entityId,
            createdAt: formatDate(log.createdAt)
          }))}
        />
      )}
    </div>
  );
}

export default AuditLog;
