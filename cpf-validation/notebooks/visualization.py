
# ============================================================================
# File: visualization_notebook.py
# Purpose: Jupyter notebook for CPF visualizations (as Python script)
# ============================================================================

# This would be a Jupyter notebook (.ipynb) file
# Here's the Python code that would go in the cells:

# %% [markdown]
# # CPF Validation Framework - Visualization and Analysis
# 
# This notebook provides interactive visualizations and analysis of the CPF framework validation results.

# %% Import libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# Import CPF modules
from bayesian_model import CPFBayesianModel, CPFState
from synthetic_generator import SyntheticOrganization, OrganizationType
from cpf_indicators import CPFIndicatorSet
from validation import CPFValidator
from incident_reconstruction import IncidentReconstructor

# Set style
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

# %% Generate synthetic data for visualization
print("Generating synthetic organizational data...")

# Generate data for multiple organizations
org_types = [OrganizationType.FINANCIAL, OrganizationType.HEALTHCARE, 
             OrganizationType.TECHNOLOGY, OrganizationType.GOVERNMENT]

all_data = []
for org_type in org_types:
    org = SyntheticOrganization(org_type, size=1000, duration_days=180, seed=42)
    df = org.generate_dataset()
    all_data.append(df)

combined_df = pd.concat(all_data, ignore_index=True)
print(f"Generated {len(combined_df)} organization-days of data")
print(f"Total incidents: {combined_df['security_incident'].sum()}")

# %% Visualize stress patterns over time
fig = make_subplots(
    rows=2, cols=2,
    subplot_titles=[t.value.title() for t in org_types],
    shared_yaxes=True
)

for i, (org_type, df) in enumerate(zip(org_types, all_data)):
    row = i // 2 + 1
    col = i % 2 + 1
    
    # Calculate rolling average
    df['stress_ma'] = df['stress_level'].rolling(window=7).mean()
    
    fig.add_trace(
        go.Scatter(
            x=df['date'],
            y=df['stress_level'],
            mode='lines',
            name=f'{org_type.value} (raw)',
            line=dict(width=0.5, color='lightgray'),
            showlegend=False
        ),
        row=row, col=col
    )
    
    fig.add_trace(
        go.Scatter(
            x=df['date'],
            y=df['stress_ma'],
            mode='lines',
            name=f'{org_type.value} (7-day avg)',
            line=dict(width=2)
        ),
        row=row, col=col
    )
    
    # Mark incidents
    incidents = df[df['security_incident']]
    if len(incidents) > 0:
        fig.add_trace(
            go.Scatter(
                x=incidents['date'],
                y=incidents['stress_level'],
                mode='markers',
                name='Incidents',
                marker=dict(size=8, color='red', symbol='x'),
                showlegend=(i == 0)
            ),
            row=row, col=col
        )

fig.update_layout(
    height=600,
    title_text="Stress Patterns and Security Incidents by Organization Type",
    hovermode='x unified'
)
fig.update_yaxes(title_text="Stress Level", range=[0, 1])
fig.update_xaxes(title_text="Date")
fig.show()

# %% CPF Category Analysis
indicator_set = CPFIndicatorSet()
category_scores = []

for df in all_data:
    indicators = indicator_set.calculate_all(df)
    cat_scores = indicator_set.get_category_scores(indicators)
    category_scores.append(cat_scores)

# Create heatmap
categories = list(category_scores[0].keys())
org_names = [org_type.value for org_type in org_types]

heatmap_data = np.array([[scores.get(cat, 0) for cat in categories] 
                         for scores in category_scores])

fig = go.Figure(data=go.Heatmap(
    z=heatmap_data,
    x=categories,
    y=org_names,
    colorscale='RdYlGn_r',
    text=np.round(heatmap_data, 2),
    texttemplate="%{text}",
    textfont={"size": 12},
    colorbar=dict(title="Risk Score")
))

fig.update_layout(
    title="CPF Risk Scores by Category and Organization Type",
    xaxis_title="CPF Category",
    yaxis_title="Organization Type",
    height=400
)
fig.show()

# %% Convergence Index Analysis
fig = go.Figure()

for org_type, df in zip(org_types, all_data):
    fig.add_trace(go.Box(
        y=df['convergence_index'],
        name=org_type.value,
        boxmean='sd'
    ))

fig.update_layout(
    title="Convergence Index Distribution by Organization Type",
    yaxis_title="Convergence Index",
    xaxis_title="Organization Type",
    height=400,
    showlegend=False
)

# Add critical threshold line
fig.add_hline(y=0.6, line_dash="dash", line_color="red", 
              annotation_text="Critical Threshold")
fig.show()

# %% Model Performance - ROC Curve
from sklearn.metrics import roc_curve, auc

# Generate predictions
model = CPFBayesianModel()
all_predictions = []
all_actuals = []

for _, row in combined_df.iterrows():
    state = CPFState(
        authority=row.get('compliance_rate', 0.5),
        temporal=row.get('stress_level', 0.5),
        social=row.get('social_proof_susceptibility', 0.5),
        affective=0.5,
        cognitive=row.get('error_rate', 0.3) * 3,
        group=1.0 if row.get('group_state') != 'work' else 0.3,
        stress=row.get('stress_level', 0.5),
        unconscious=0.5,
        ai_specific=row.get('automation_bias', 0.5),
        convergence=row.get('convergence_index', 0.3)
    )
    
    pred = model.predict_incident_probability(state)
    all_predictions.append(pred['final_probability'])
    all_actuals.append(1 if row['security_incident'] else 0)

# Calculate ROC curve
fpr, tpr, thresholds = roc_curve(all_actuals, all_predictions)
roc_auc = auc(fpr, tpr)

# Plot
fig = go.Figure()
fig.add_trace(go.Scatter(
    x=fpr, y=tpr,
    mode='lines',
    name=f'CPF Model (AUC = {roc_auc:.3f})',
    line=dict(width=2)
))

# Add diagonal reference line
fig.add_trace(go.Scatter(
    x=[0, 1], y=[0, 1],
    mode='lines',
    name='Random Classifier',
    line=dict(dash='dash', color='gray')
))

fig.update_layout(
    title="ROC Curve - CPF Model Performance",
    xaxis_title="False Positive Rate",
    yaxis_title="True Positive Rate",
    width=600,
    height=600,
    xaxis=dict(range=[0, 1]),
    yaxis=dict(range=[0, 1])
)
fig.show()

# %% Temporal Prediction Accuracy
# Analyze how accuracy varies with prediction horizon
horizons = list(range(1, 31))  # 1 to 30 days
accuracies = []

for horizon in horizons:
    correct = 0
    total = 0
    
    for i in range(len(combined_df) - horizon):
        if all_predictions[i] > 0.5:  # Predicted incident
            total += 1
            # Check if incident occurred within horizon
            if any(combined_df.iloc[i:i+horizon]['security_incident']):
                correct += 1
    
    accuracy = correct / total if total > 0 else 0
    accuracies.append(accuracy)

fig = go.Figure()
fig.add_trace(go.Scatter(
    x=horizons,
    y=accuracies,
    mode='lines+markers',
    name='Prediction Accuracy',
    line=dict(width=2)
))

fig.add_vline(x=7, line_dash="dash", line_color="green", 
              annotation_text="7-day horizon")
fig.add_vline(x=14, line_dash="dash", line_color="orange", 
              annotation_text="14-day horizon")

fig.update_layout(
    title="CPF Prediction Accuracy by Time Horizon",
    xaxis_title="Prediction Horizon (days)",
    yaxis_title="Accuracy",
    height=400
)
fig.show()

# %% Incident Type Distribution
incident_types = combined_df[combined_df['security_incident']]['incident_type'].value_counts()

fig = go.Figure(data=[
    go.Bar(
        x=incident_types.index,
        y=incident_types.values,
        text=incident_types.values,
        textposition='auto',
    )
])

fig.update_layout(
    title="Distribution of Security Incident Types",
    xaxis_title="Incident Type",
    yaxis_title="Count",
    height=400
)
fig.show()

# %% Factor Importance Analysis
# Analyze which factors contribute most to incidents
factors = ['stress_level', 'compliance_rate', 'error_rate', 
           'alert_dismissal_rate', 'convergence_index']

importance_scores = []
for factor in factors:
    # Calculate correlation with incidents
    correlation = combined_df[factor].corr(combined_df['security_incident'])
    importance_scores.append(abs(correlation))

fig = go.Figure(data=[
    go.Bar(
        x=factors,
        y=importance_scores,
        text=[f'{s:.3f}' for s in importance_scores],
        textposition='auto',
        marker_color=importance_scores,
        marker_colorscale='Reds'
    )
])

fig.update_layout(
    title="Factor Importance for Security Incidents",
    xaxis_title="Factor",
    yaxis_title="Correlation with Incidents",
    height=400
)
fig.show()

# %% Group Dynamics Evolution
# Visualize how group states evolve over time
tech_df = all_data[2]  # Technology organization

# Convert group states to numeric for visualization
state_mapping = {'work': 0, 'baD': 1, 'baF': 2, 'baP': 3}
tech_df['group_state_numeric'] = tech_df['group_state'].map(state_mapping)

fig = make_subplots(
    rows=2, cols=1,
    row_heights=[0.7, 0.3],
    shared_xaxes=True,
    vertical_spacing=0.05
)

# Group state evolution
fig.add_trace(
    go.Scatter(
        x=tech_df['date'],
        y=tech_df['group_state_numeric'],
        mode='lines',
        name='Group State',
        line=dict(width=2),
        yaxis='y'
    ),
    row=1, col=1
)

# Stress level
fig.add_trace(
    go.Scatter(
        x=tech_df['date'],
        y=tech_df['stress_level'],
        mode='lines',
        name='Stress Level',
        line=dict(width=1, color='red')
    ),
    row=2, col=1
)

fig.update_yaxes(
    title_text="Group State",
    ticktext=['Work', 'Dependency', 'Fight-Flight', 'Pairing'],
    tickvals=[0, 1, 2, 3],
    row=1, col=1
)

fig.update_yaxes(title_text="Stress", row=2, col=1)
fig.update_xaxes(title_text="Date", row=2, col=1)

fig.update_layout(
    title="Group Dynamics Evolution (Technology Organization)",
    height=500,
    hovermode='x unified'
)
fig.show()

# %% Save summary statistics
summary_stats = {
    'Total Organizations': len(org_types),
    'Total Days': len(combined_df),
    'Total Incidents': combined_df['security_incident'].sum(),
    'Incident Rate': combined_df['security_incident'].mean(),
    'Model AUC': roc_auc,
    'Average Stress': combined_df['stress_level'].mean(),
    'Average Convergence': combined_df['convergence_index'].mean(),
    'Critical Convergence Rate': (combined_df['convergence_index'] > 0.6).mean()
}

summary_df = pd.DataFrame(summary_stats.items(), columns=['Metric', 'Value'])
print("\\nSummary Statistics:")
print(summary_df.to_string(index=False))

# Export for reporting
summary_df.to_csv('cpf_validation_summary.csv', index=False)
print("\\nSummary statistics saved to 'cpf_validation_summary.csv'")
