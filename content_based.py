"""
Content-based recommender: matches user skill profile to job descriptions
using TF-IDF vectorization and cosine similarity.
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class ContentBasedRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2))
        self.job_matrix = None
        self.jobs_df = None

    def fit(self, jobs: pd.DataFrame):
        """Fit TF-IDF on job descriptions + required skills."""
        self.jobs_df = jobs.reset_index(drop=True)
        # Combine description and skills for richer representation
        corpus = (jobs["description"] + " " + jobs["required_skills"]).tolist()
        self.job_matrix = self.vectorizer.fit_transform(corpus)
        return self

    def recommend(self, user: pd.Series, top_n: int = 5) -> pd.DataFrame:
        """
        Given a user's skills and experience, return top_n matching jobs.
        """
        # Build user profile text from skills + experience level
        user_text = user["skills"] + " " + user.get("experience_level", "")
        user_vec = self.vectorizer.transform([user_text])
        scores = cosine_similarity(user_vec, self.job_matrix).flatten()

        top_indices = np.argsort(scores)[::-1][:top_n]
        results = self.jobs_df.iloc[top_indices].copy()
        results["content_score"] = scores[top_indices]
        return results[["job_id", "title", "required_skills", "content_score"]]
