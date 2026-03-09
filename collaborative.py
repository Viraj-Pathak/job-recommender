"""
Collaborative filtering recommender using Truncated SVD (matrix factorization)
on the user-job interaction matrix.
"""

import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
from sklearn.decomposition import TruncatedSVD


class CollaborativeRecommender:
    def __init__(self, n_components: int = 15):
        self.svd = TruncatedSVD(n_components=n_components, random_state=42)
        self.user_factors = None
        self.job_factors = None
        self.user_index = {}   # user_id -> row index
        self.job_index = {}    # job_id -> col index
        self.job_ids = []

    def fit(self, interactions: pd.DataFrame, n_users: int, n_jobs: int):
        """Build and factorize the user-job interaction matrix."""
        self.user_index = {uid: i for i, uid in enumerate(range(n_users))}
        self.job_index = {jid: j for j, jid in enumerate(range(n_jobs))}
        self.job_ids = list(range(n_jobs))

        rows = [self.user_index[uid] for uid in interactions["user_id"]]
        cols = [self.job_index[jid] for jid in interactions["job_id"]]
        data = interactions["interaction"].tolist()

        matrix = csr_matrix((data, (rows, cols)), shape=(n_users, n_jobs), dtype=np.float32)

        self.user_factors = self.svd.fit_transform(matrix)
        self.job_factors = self.svd.components_.T  # shape: (n_jobs, n_components)
        return self

    def recommend(self, user_id: int, top_n: int = 5, interacted_jobs: set = None) -> pd.DataFrame:
        """
        Predict scores for all jobs for a given user and return top_n unseen jobs.
        """
        if user_id not in self.user_index:
            return pd.DataFrame(columns=["job_id", "collab_score"])

        u_idx = self.user_index[user_id]
        scores = self.user_factors[u_idx] @ self.job_factors.T

        results = pd.DataFrame({"job_id": self.job_ids, "collab_score": scores})

        if interacted_jobs:
            results = results[~results["job_id"].isin(interacted_jobs)]

        results = results.sort_values("collab_score", ascending=False).head(top_n)
        return results.reset_index(drop=True)
