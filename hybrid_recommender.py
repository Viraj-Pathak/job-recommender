"""
Hybrid recommender: combines content-based and collaborative filtering scores
using a configurable weighted blend.
"""

import pandas as pd
import numpy as np
from content_based import ContentBasedRecommender
from collaborative import CollaborativeRecommender
from data_generator import generate_jobs, generate_users, generate_interactions


class HybridRecommender:
    def __init__(self, content_weight: float = 0.5, collab_weight: float = 0.5):
        """
        Args:
            content_weight: weight for content-based scores (0–1)
            collab_weight:  weight for collaborative scores (0–1)
        """
        assert abs(content_weight + collab_weight - 1.0) < 1e-6, "Weights must sum to 1."
        self.content_weight = content_weight
        self.collab_weight = collab_weight

        self.content_rec = ContentBasedRecommender()
        self.collab_rec = CollaborativeRecommender()

        self.jobs_df = None
        self.users_df = None
        self.interactions_df = None

    def fit(self, jobs: pd.DataFrame, users: pd.DataFrame, interactions: pd.DataFrame):
        self.jobs_df = jobs
        self.users_df = users
        self.interactions_df = interactions

        self.content_rec.fit(jobs)
        self.collab_rec.fit(interactions, n_users=len(users), n_jobs=len(jobs))
        return self

    def _normalize(self, series: pd.Series) -> pd.Series:
        min_val, max_val = series.min(), series.max()
        if max_val == min_val:
            return pd.Series(np.zeros(len(series)), index=series.index)
        return (series - min_val) / (max_val - min_val)

    def recommend(self, user_id: int, top_n: int = 5) -> pd.DataFrame:
        """Return top_n job recommendations for a user using hybrid scoring."""
        user = self.users_df[self.users_df["user_id"] == user_id].iloc[0]

        interacted = set(
            self.interactions_df[self.interactions_df["user_id"] == user_id]["job_id"]
        )

        # --- Content-based scores (all jobs) ---
        cb_results = self.content_rec.recommend(user, top_n=len(self.jobs_df))
        cb_results["content_score"] = self._normalize(cb_results["content_score"])

        # --- Collaborative scores (all jobs) ---
        cf_results = self.collab_rec.recommend(user_id, top_n=len(self.jobs_df))
        cf_results["collab_score"] = self._normalize(cf_results["collab_score"])

        # --- Merge and blend ---
        merged = cb_results.merge(cf_results, on="job_id", how="outer").fillna(0)
        merged["hybrid_score"] = (
            self.content_weight * merged["content_score"]
            + self.collab_weight * merged["collab_score"]
        )

        # Remove already-interacted jobs
        merged = merged[~merged["job_id"].isin(interacted)]
        merged = merged.sort_values("hybrid_score", ascending=False).head(top_n)

        # Attach extra job details not already in merged
        result = merged.merge(
            self.jobs_df[["job_id", "experience_level", "salary"]],
            on="job_id",
        )
        return result[
            ["job_id", "title", "experience_level", "required_skills",
             "salary", "content_score", "collab_score", "hybrid_score"]
        ].reset_index(drop=True)


if __name__ == "__main__":
    jobs = generate_jobs(50)
    users = generate_users(30)
    interactions = generate_interactions(users, jobs)

    recommender = HybridRecommender(content_weight=0.5, collab_weight=0.5)
    recommender.fit(jobs, users, interactions)

    # Test for user 0
    user = users.iloc[0]
    print(f"\nUser profile:")
    print(f"  Skills: {user['skills']}")
    print(f"  Experience: {user['experience_years']} years ({user['experience_level']})")

    recs = recommender.recommend(user_id=0, top_n=5)
    print(f"\nTop 5 job recommendations:")
    print(recs.to_string(index=False))
