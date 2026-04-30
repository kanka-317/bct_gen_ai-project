import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
import joblib
import os

# Set aesthetic style
sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['font.family'] = 'sans-serif'

def generate_plots():
    print("Loading augmented dataset...")
    if not os.path.exists('Symptom2Disease_with_Labs.csv'):
        print("Error: Symptom2Disease_with_Labs.csv not found. Please run the notebook first.")
        return

    df = pd.read_csv('Symptom2Disease_with_Labs.csv')

    # 1. Disease Distribution
    print("Generating Disease Distribution plot...")
    plt.figure(figsize=(12, 6))
    sns.countplot(data=df, y='label', order=df['label'].value_counts().index, palette='viridis')
    plt.title('Prevalence of Diseases in Clinical Dataset', fontsize=16, fontweight='bold')
    plt.xlabel('Number of Case Records')
    plt.ylabel('Clinical Condition')
    plt.tight_layout()
    plt.savefig('disease_distribution.png', dpi=300)
    plt.close()

    # 2. Lab Value Analysis
    print("Generating Lab Value Analysis plots...")
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    features = ['Temperature_F', 'WBC_Count', 'Fasting_Blood_Sugar', 'Bilirubin_Total']
    
    for i, feat in enumerate(features):
        ax = axes[i//2, i%2]
        sns.boxplot(data=df, x=feat, y='label', ax=ax, palette='Set2')
        ax.set_title(f'{feat} Variation by Disease', fontsize=12, fontweight='bold')
        ax.set_ylabel('')
    
    plt.tight_layout()
    plt.savefig('lab_value_analysis.png', dpi=300)
    plt.close()

    # 3. Correlation Heatmap
    print("Generating Correlation Heatmap...")
    plt.figure(figsize=(12, 10))
    numeric_df = df.select_dtypes(include=[np.number])
    corr = numeric_df.corr()
    sns.heatmap(corr, annot=True, cmap='RdYlGn', center=0, fmt='.2f', linewidths=0.5)
    plt.title('Clinical Feature Correlation Matrix', fontsize=16, fontweight='bold')
    plt.tight_layout()
    plt.savefig('correlation_heatmap.png', dpi=300)
    plt.close()

    print("\nVisualizations generated successfully:")
    print("- disease_distribution.png")
    print("- lab_value_analysis.png")
    print("- correlation_heatmap.png")

if __name__ == "__main__":
    generate_plots()
