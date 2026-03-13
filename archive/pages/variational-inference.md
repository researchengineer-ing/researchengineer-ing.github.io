---
title: "Variational Inference from First Principles"
date: 2026-03-10
tags: ["variational-inference", "ELBO", "probabilistic-models", "PMML"]
pillar: foundations
---

# Variational Inference from First Principles

Variational inference (VI) is a framework for approximating intractable posterior distributions using optimization. Rather than sampling from the true posterior $p(\mathbf{z} \mid \mathbf{x})$, we posit a family of tractable distributions $\mathcal{Q}$ and find the member $q^*(\mathbf{z}) \in \mathcal{Q}$ that is closest to the true posterior in KL divergence. This page derives the core machinery from scratch.

---

## The Core Problem: Posterior Intractability

Given observed data $\mathbf{x}$ and latent variables $\mathbf{z}$, Bayes' theorem gives us:

$$p(\mathbf{z} \mid \mathbf{x}) = \frac{p(\mathbf{x} \mid \mathbf{z})\, p(\mathbf{z})}{p(\mathbf{x})}$$

The denominator $p(\mathbf{x}) = \int p(\mathbf{x} \mid \mathbf{z})\, p(\mathbf{z})\, d\mathbf{z}$ is the **marginal likelihood** or **evidence**. For all but the simplest models (conjugate exponential family pairs), this integral is analytically intractable — it requires integrating over a high-dimensional latent space with no closed form.

Variational inference sidesteps direct computation of $p(\mathbf{x})$ by converting the integration problem into an **optimization problem**.

---

## Deriving the Evidence Lower Bound

<Definition term="Evidence Lower Bound (ELBO)">
For any distribution $q(\mathbf{z})$ over the latent variables, the **Evidence Lower Bound** is:

$$\mathcal{L}(q) = \mathbb{E}_{q(\mathbf{z})}\!\left[\log \frac{p(\mathbf{x}, \mathbf{z})}{q(\mathbf{z})}\right]$$

It satisfies $\log p(\mathbf{x}) \geq \mathcal{L}(q)$ for all $q$, with equality iff $q(\mathbf{z}) = p(\mathbf{z} \mid \mathbf{x})$.
</Definition>

The derivation proceeds via Jensen's inequality or, more illuminatingly, by decomposing the log-evidence:

$$\log p(\mathbf{x}) = \log \int p(\mathbf{x}, \mathbf{z})\, d\mathbf{z}$$

Multiply and divide inside the integral by any $q(\mathbf{z}) > 0$:

$$\log p(\mathbf{x}) = \log \int q(\mathbf{z}) \cdot \frac{p(\mathbf{x}, \mathbf{z})}{q(\mathbf{z})}\, d\mathbf{z} = \log \,\mathbb{E}_{q}\!\left[\frac{p(\mathbf{x}, \mathbf{z})}{q(\mathbf{z})}\right]$$

Since $\log$ is concave, Jensen's inequality gives us:

$$\log p(\mathbf{x}) \geq \mathbb{E}_{q}\!\left[\log \frac{p(\mathbf{x}, \mathbf{z})}{q(\mathbf{z})}\right] = \mathcal{L}(q)$$

### The KL Decomposition

The gap between the log-evidence and the ELBO has a clean form:

<Theorem name="ELBO–KL Decomposition">
For any distribution $q(\mathbf{z})$ with $\text{supp}(q) \subseteq \text{supp}(p(\cdot \mid \mathbf{x}))$:

$$\log p(\mathbf{x}) = \mathcal{L}(q) + \mathrm{KL}\!\left(q(\mathbf{z}) \,\|\, p(\mathbf{z} \mid \mathbf{x})\right)$$

where $\mathrm{KL}(q \| p) = \mathbb{E}_{q}\!\left[\log \frac{q(\mathbf{z})}{p(\mathbf{z} \mid \mathbf{x})}\right] \geq 0$.
</Theorem>

<Proof>
Expand the KL term:

$$\mathrm{KL}(q \| p(\cdot \mid \mathbf{x})) = \mathbb{E}_{q}\!\left[\log q(\mathbf{z}) - \log p(\mathbf{z} \mid \mathbf{x})\right]$$

Substitute $\log p(\mathbf{z} \mid \mathbf{x}) = \log p(\mathbf{x}, \mathbf{z}) - \log p(\mathbf{x})$:

$$= \mathbb{E}_{q}\!\left[\log q(\mathbf{z}) - \log p(\mathbf{x}, \mathbf{z}) + \log p(\mathbf{x})\right]$$

$$= -\mathbb{E}_{q}\!\left[\log \frac{p(\mathbf{x}, \mathbf{z})}{q(\mathbf{z})}\right] + \log p(\mathbf{x})$$

$$= -\mathcal{L}(q) + \log p(\mathbf{x})$$

Rearranging: $\log p(\mathbf{x}) = \mathcal{L}(q) + \mathrm{KL}(q \| p(\cdot \mid \mathbf{x}))$.
</Proof>

### Why Maximizing the ELBO Minimizes the KL

Since $\log p(\mathbf{x})$ does not depend on $q$, the decomposition

$$\log p(\mathbf{x}) = \mathcal{L}(q) + \mathrm{KL}(q \| p(\cdot \mid \mathbf{x}))$$

tells us that **maximizing $\mathcal{L}(q)$ over $q$ is equivalent to minimizing $\mathrm{KL}(q \| p(\cdot \mid \mathbf{x}))$**. This is the core insight: VI frames posterior inference as an optimization problem over the variational family $\mathcal{Q}$.

### Alternative Form: Likelihood minus KL

Expanding the joint: $\log p(\mathbf{x}, \mathbf{z}) = \log p(\mathbf{x} \mid \mathbf{z}) + \log p(\mathbf{z})$

$$\mathcal{L}(q) = \mathbb{E}_{q}\!\left[\log p(\mathbf{x} \mid \mathbf{z})\right] - \mathrm{KL}\!\left(q(\mathbf{z}) \,\|\, p(\mathbf{z})\right)$$

This form is intuitive: the ELBO is the expected log-likelihood minus a **regularization term** that penalizes $q$ for diverging from the prior. Maximizing the ELBO forces $q$ to explain the data while staying close to the prior — a variational Occam's razor.

---

## The Mean Field Approximation

To make the optimization tractable, we restrict $\mathcal{Q}$ to **fully factorized** (mean field) distributions:

<Definition term="Mean Field Family">
The mean field variational family assumes that the latent variables $\mathbf{z} = (z_1, \ldots, z_d)$ are **mutually independent** under $q$:

$$q(\mathbf{z}) = \prod_{j=1}^{d} q_j(z_j)$$

Each $q_j$ is called a **variational factor**.
</Definition>

<Callout type="note">
Mean field is a strong independence assumption — it cannot capture posterior correlations between latent variables. More expressive families (structured VI, normalizing flows) can capture dependencies at the cost of increased complexity.
</Callout>

### Optimal Mean Field Factors

Under the mean field assumption, the optimal factor for variable $z_j$ has a beautifully clean form:

<Theorem name="Optimal Mean Field Factor">
Holding all other factors $\{q_k\}_{k \neq j}$ fixed, the ELBO is maximized when:

$$\log q_j^*(z_j) = \mathbb{E}_{q_{-j}}\!\left[\log p(\mathbf{x}, \mathbf{z})\right] + \text{const}$$

where the expectation is over all variables except $z_j$, and the constant ensures normalization.
</Theorem>

<Proof>
Write $\mathcal{L}(q)$ isolating the terms involving $q_j$:

$$\mathcal{L}(q) = \int q_j(z_j)\left[\int \prod_{k \neq j} q_k(z_k) \cdot \log p(\mathbf{x}, \mathbf{z})\, d\mathbf{z}_{-j}\right] dz_j - \int q_j(z_j) \log q_j(z_j)\, dz_j + \text{const}_{-j}$$

Let $\tilde{p}(z_j) \propto \exp\!\left(\mathbb{E}_{q_{-j}}\!\left[\log p(\mathbf{x}, \mathbf{z})\right]\right)$. Then:

$$\mathcal{L}(q) = -\mathrm{KL}(q_j \| \tilde{p}) + \text{const}$$

This is maximized when $q_j = \tilde{p}$, i.e., $\log q_j^*(z_j) = \mathbb{E}_{q_{-j}}[\log p(\mathbf{x}, \mathbf{z})] + \text{const}$.
</Proof>

---

## Coordinate Ascent Variational Inference (CAVI)

CAVI exploits the optimal factor update to iteratively maximize the ELBO:

<Algorithm name="Coordinate Ascent Variational Inference (CAVI)">
**Input:** Model $p(\mathbf{x}, \mathbf{z})$, observed data $\mathbf{x}$, mean field family $\{q_j\}_{j=1}^d$

**Initialize:** $q_j(z_j)$ for $j = 1, \ldots, d$ (e.g., randomly or from prior)

**Repeat until ELBO converges:**
1. For each factor $j = 1, \ldots, d$:
   $$\log q_j(z_j) \leftarrow \mathbb{E}_{q_{-j}}\!\left[\log p(\mathbf{x}, \mathbf{z})\right] + \text{const}$$
2. Normalize: $q_j(z_j) \leftarrow q_j(z_j) / \int q_j(z_j)\, dz_j$
3. Compute ELBO: $\mathcal{L} \leftarrow \mathbb{E}_{q}\!\left[\log p(\mathbf{x}, \mathbf{z}) - \log q(\mathbf{z})\right]$

**Output:** $q^*(\mathbf{z}) = \prod_j q_j^*(z_j)$
</Algorithm>

**Convergence.** CAVI is guaranteed to converge to a local optimum of the ELBO (since each coordinate update is an exact maximization), but not to the global optimum. The final solution depends on initialization.

**Complexity.** For exponential family models with conjugate priors, the CAVI updates take closed form. The expected log joint $\mathbb{E}_{q_{-j}}[\log p(\mathbf{x}, \mathbf{z})]$ often reduces to a simple function of the variational parameters' sufficient statistics.

---

## Example: Bayesian Gaussian Mixture Model

For a Gaussian mixture with $K$ components, latent assignments $\mathbf{c}$ (one-hot), and means $\boldsymbol{\mu}_k$, the mean field family is:

$$q(\boldsymbol{\mu}, \mathbf{c}) = \prod_{k=1}^K q(\mu_k) \cdot \prod_{n=1}^N q(c_n)$$

The CAVI updates take the form:

$$q(c_{nk}) \propto \exp\!\left(\mathbb{E}_q[\log \pi_k] + \mathbb{E}_q\!\left[\log \mathcal{N}(x_n \mid \mu_k, \sigma^2)\right]\right)$$

$$q(\mu_k) = \mathcal{N}\!\left(\mu_k \;\Big|\; \frac{\sum_n \mathbb{E}[c_{nk}] x_n}{\sum_n \mathbb{E}[c_{nk}] + \sigma^2/\sigma_0^2},\; \left(\frac{\sum_n \mathbb{E}[c_{nk}]}{\sigma^2} + \frac{1}{\sigma_0^2}\right)^{-1}\right)$$

These are soft-assignment E-step and M-step analogues, but operating on variational parameters rather than point estimates — the key difference from the EM algorithm.

---

## Beyond Mean Field

<Callout type="tip">
**Modern extensions:** Black-box variational inference (BBVI) uses Monte Carlo gradient estimators (REINFORCE or reparameterization trick) to optimize the ELBO for any model differentiably. Amortized VI (as in VAEs) learns an **inference network** $q_\phi(\mathbf{z} \mid \mathbf{x})$ to map data to variational parameters, enabling scalable per-datapoint inference in a single forward pass.
</Callout>

The reparameterization trick writes $z = g(\epsilon, \phi)$ where $\epsilon \sim p(\epsilon)$ is a noise variable independent of the parameters, allowing:

$$\nabla_\phi \,\mathbb{E}_{q_\phi}[f(z)] = \mathbb{E}_{p(\epsilon)}\!\left[\nabla_\phi f(g(\epsilon, \phi))\right]$$

This low-variance gradient estimator is the backbone of the VAE training objective and most modern deep generative model training pipelines.

---

## Summary

| Concept | Key formula |
|---|---|
| ELBO | $\mathcal{L}(q) = \mathbb{E}_q[\log p(\mathbf{x}, \mathbf{z})] - \mathbb{E}_q[\log q(\mathbf{z})]$ |
| KL decomposition | $\log p(\mathbf{x}) = \mathcal{L}(q) + \mathrm{KL}(q \| p(\cdot \mid \mathbf{x}))$ |
| Likelihood–KL form | $\mathcal{L}(q) = \mathbb{E}_q[\log p(\mathbf{x} \mid \mathbf{z})] - \mathrm{KL}(q(\mathbf{z}) \| p(\mathbf{z}))$ |
| Optimal MF factor | $\log q_j^*(z_j) = \mathbb{E}_{q_{-j}}[\log p(\mathbf{x}, \mathbf{z})] + C$ |
| CAVI | Cycle through factors, apply optimal update |

Variational inference transformed Bayesian modeling from a sampling-centric discipline into an optimization-centric one, enabling scalable, differentiable, and amortizable posterior approximation — a shift that underlies the entire modern deep generative model landscape.
