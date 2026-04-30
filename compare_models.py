import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.metrics import accuracy_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import MinMaxScaler
import warnings

warnings.filterwarnings('ignore')

def main():
    print("Loading data...")
    df = pd.read_csv('Symptom2Disease_with_Labs.csv')
    
    # Features and Target
    X = df.drop(columns=['label', 'Unnamed: 0'], errors='ignore')
    y = df['label']
    
    # Train Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    text_col = 'text'
    num_cols = ['Temperature_F', 'Systolic_BP', 'Diastolic_BP', 'WBC_Count', 'Fasting_Blood_Sugar', 'Bilirubin_Total']
    
    # Base Preprocessor
    def get_pipeline(classifier, use_minmax=False):
        scaler = MinMaxScaler() if use_minmax else StandardScaler()
        preprocessor = ColumnTransformer(
            transformers=[
                ('text', TfidfVectorizer(max_features=2000), text_col),
                ('num', scaler, num_cols)
            ]
        )
        return Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', classifier)
        ])

    models = {
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "SVM": SVC(kernel='linear', probability=True, random_state=42),
        "KNN": KNeighborsClassifier(n_neighbors=5),
        "Naïve Bayes": MultinomialNB(),
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42)
    }
    
    results = []
    
    print("\nStarting model comparison...")
    for name, clf in models.items():
        print(f"Training {name}...")
        # Use MinMaxScaler for Naive Bayes to avoid negative values from TF-IDF/Scaling
        pipeline = get_pipeline(clf, use_minmax=(name == "Naïve Bayes"))
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        results.append({"Model": name, "Accuracy": acc})
        print(f"{name} Accuracy: {acc:.4f}")
        
    results_df = pd.DataFrame(results).sort_values(by="Accuracy", ascending=False)
    print("\nFinal Results:")
    print(results_df)
    
    # Plotting
    plt.figure(figsize=(10, 6))
    sns.set_style("whitegrid")
    ax = sns.barplot(x="Accuracy", y="Model", data=results_df, palette="viridis")
    plt.title("Model Performance Comparison (Accuracy)", fontsize=15)
    plt.xlabel("Accuracy Score", fontsize=12)
    plt.ylabel("ML Model", fontsize=12)
    plt.xlim(0, 1.1)
    
    # Add labels to bars
    for p in ax.patches:
        ax.annotate(f'{p.get_width():.4f}', 
                    (p.get_width(), p.get_y() + p.get_height() / 2.), 
                    ha = 'center', va = 'center', 
                    xytext = (20, 0), 
                    textcoords = 'offset points')
                    
    plt.tight_layout()
    plt.savefig('model_comparison.png')
    print("\nGraph saved as 'model_comparison.png'")
    
    # Save results to csv for reporting
    results_df.to_csv('model_results.csv', index=False)

if __name__ == "__main__":
    main()
