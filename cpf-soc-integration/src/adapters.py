from abc import ABC, abstractmethod
import pandas as pd
from datetime import datetime
# Assume QualysAPI is a custom class; stub it
class QualysAPI:
    def __init__(self, username, password, platform):
        pass
    
    async def get_detections(self, **kwargs):
        return {}  # Dummy raw data

class ScannerAdapter(ABC):
    @abstractmethod
    async def fetch_vulnerabilities(self, since: datetime) -> pd.DataFrame:
        pass

    @abstractmethod
    def normalize_severity(self, severity: str) -> float:
        pass

class QualysAdapter(ScannerAdapter):
    def __init__(self, config):
        self.api = QualysAPI(
            username=config['username'],
            password=config['password'],
            platform=config['platform']
        )
    
    async def fetch_vulnerabilities(self, since):
        raw_data = await self.api.get_detections(
            detection_updated_since=since,
            include_ignored=True,
            include_disabled=True
        )
        
        return self.transform_to_dataframe(raw_data)
    
    def normalize_severity(self, severity):
        mapping = {5: 10.0, 4: 7.5, 3: 5.0, 2: 2.5, 1: 1.0}
        return mapping.get(severity, 0.0)
    
    # Stub
    def transform_to_dataframe(self, raw_data):
        return pd.DataFrame()

class TenableAdapter(ScannerAdapter):
    # Similar implementation for Tenable.io
    pass

class Rapid7Adapter(ScannerAdapter):
    # Similar implementation for Rapid7 InsightVM
    pass
