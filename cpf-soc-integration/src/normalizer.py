import pandas as pd

class DataNormalizer:
    def __init__(self):
        self.severity_mapping = {
            # Normalize severity across platforms
            'qualys': {5: 'Critical', 4: 'High', 3: 'Medium', 2: 'Low', 1: 'Info'},
            'tenable': {'critical': 'Critical', 'high': 'High', 'medium': 'Medium', 'low': 'Low'},
            'rapid7': {'Critical': 'Critical', 'Severe': 'High', 'Moderate': 'Medium', 'Low': 'Low'}
        }
    
    def merge_scanner_data(self, qualys_df, tenable_df, rapid7_df):
        # Normalize timestamps
        for df in [qualys_df, tenable_df, rapid7_df]:
            if not df.empty:
                df['first_detected'] = pd.to_datetime(df['first_detected'], errors='coerce')
                df['last_detected'] = pd.to_datetime(df['last_detected'], errors='coerce')
        
        # Create unified host identifier
        def create_host_key(row):
            # Use IP as primary key, hostname as fallback
            return row['ip'] if pd.notna(row['ip']) else row['hostname']
        
        for df in [qualys_df, tenable_df, rapid7_df]:
            if not df.empty:
                df['host_key'] = df.apply(create_host_key, axis=1)
        
        # Merge on CVE + host_key
        merged = pd.concat([qualys_df, tenable_df, rapid7_df], ignore_index=True)
        
        # Group by host_key and CVE to consolidate findings
        if not merged.empty:
            consolidated = merged.groupby(['host_key', 'cve']).agg({
                'first_detected': 'min',  # Earliest detection
                'last_detected': 'max',   # Most recent detection
                'severity': 'max',  # Highest severity
                'source': lambda x: list(x),  # All sources that found it
                'times_detected': 'sum',  # Total detections
                'patch_available': 'any',  # If any source says patch available
                'exploit_available': 'any',  # If any source says exploit available
                'ignored': 'all',  # If all sources have it ignored
                'status': lambda x: 'ACTIVE' if 'ACTIVE' in list(x) else 'RESOLVED'
            }).reset_index()
        else:
            consolidated = pd.DataFrame()
        
        return consolidated
