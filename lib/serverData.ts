// Global in-memory storage for server data (shared across all serverless instances)
declare global {
  var liveData: any;
}

if (!global.liveData) {
  global.liveData = {
    timestamp: 0,
    online: 0,
    maxPlayers: 100,
    version: '1.21.8',
    tps: 20.0,
    players: []
  };
}

export function getLiveData() {
  return global.liveData;
}

export function setLiveData(data: any) {
  global.liveData = data;
}

export function isDataRecent() {
  const dataAge = Date.now() - global.liveData.timestamp;
  return dataAge < 120000 && global.liveData.timestamp > 0;
}
