---
title: "Northstar Map — 81 Topics in Machine Learning"
date: 2026-03-13
---

# Northstar Map

A comprehensive taxonomy of 81 topics spanning the mathematical foundations, research frontiers, and engineering systems of modern machine learning. This map serves as a living curriculum and orientation guide.

---

## Pillar I — Math, Algorithm, Theory, Computation

*The bedrock. Before building, understand.*

This pillar covers the mathematical infrastructure underlying all of machine learning: the linear-algebraic skeleton, the probabilistic language, the computational constraints, and the statistical guarantees that determine when and why learning is possible.

### Linear Algebra and Calculus

**1. Linear Algebra**
Vectors, matrices, eigendecompositions, SVD, norms, and the geometric intuitions that underpin nearly every learning algorithm.

**2. Multivariate Calculus**
Partial derivatives, the Jacobian and Hessian, chain rule in multiple dimensions, Taylor expansions, and their roles in gradient-based learning.

**3. Probability Theory**
Probability spaces, random variables, distributions, expectation, variance, conditional probability, and the laws of large numbers and central limit theorem.

**4. Measure Theory and Integration**
Sigma-algebras, Lebesgue measure, integration, dominated convergence, and Radon-Nikodym derivatives — the rigorous language behind probabilistic ML.

**5. Information Theory**
Entropy, KL divergence, mutual information, channel capacity, and the information-theoretic view of compression, coding, and learning.

### Optimization

**6. Convex Optimization**
Convex sets and functions, duality, KKT conditions, gradient descent convergence rates, proximal methods, and LP/QP/SDP solvers.

**7. Nonconvex and Stochastic Optimization**
SGD, Adam, momentum methods, learning rate schedules, saddle points, loss landscape geometry, and convergence in the nonconvex setting.

**8. Numerical Methods and Linear Solvers**
Direct and iterative solvers (CG, GMRES), numerical stability, conditioning, floating-point arithmetic, and their impact on large-scale ML.

### Computation and Complexity

**9. Algorithmic Foundations and Data Structures**
Asymptotic analysis, sorting, hashing, trees, graphs, and the algorithmic primitives that enable efficient ML pipelines.

**10. Computational Complexity Theory**
P vs NP, NP-hardness reductions, approximation algorithms, hardness of learning, and the complexity of inference and optimization problems in ML.

**11. Online Learning and Bandits**
Regret minimization, the adversarial and stochastic bandit settings, UCB, Thompson Sampling, EXP3, and connections to online convex optimization.

### Learning Theory

**12. PAC Learning and VC Theory**
Probably Approximately Correct learning, VC dimension, the fundamental theorem of learning, and sample complexity bounds.

**13. Rademacher Complexity and Generalization**
Data-dependent complexity measures, Rademacher averages, covering numbers, and tight generalization bounds for hypothesis classes.

**14. Algorithmic Stability and Uniform Convergence**
Leave-one-out stability, uniform convergence of empirical processes, and their use in proving generalization for modern algorithms.

**15. Statistical Decision Theory**
Risk minimization, Bayes optimal classifiers, minimax estimation, admissibility, and the frequentist/Bayesian foundations of estimation.

### Probabilistic Modeling

**16. Probabilistic Graphical Models**
Directed and undirected graphical models, d-separation, the junction tree algorithm, factor graphs, and exact inference.

**17. Bayesian Inference and Posterior Computation**
Bayes' theorem, conjugate priors, hierarchical models, posterior predictive distributions, and the mechanics of Bayesian updating.

**18. Variational Inference and the ELBO**
Evidence lower bound derivation, mean-field approximation, CAVI updates, black-box VI, and amortized inference.

**19. Monte Carlo Methods and MCMC**
Importance sampling, rejection sampling, Markov Chain Monte Carlo, Metropolis-Hastings, Hamiltonian Monte Carlo, and convergence diagnostics.

**20. Markov Chains and Mixing Times**
Ergodicity, stationary distributions, spectral gaps, coupling arguments, and total variation bounds — the theory behind MCMC.

**21. Expectation Propagation and Message Passing**
Belief propagation, loopy BP, expectation propagation, and approximate inference in graphical models via message-passing algorithms.

### Spectral and Kernel Methods

**22. Spectral Methods and Random Matrix Theory**
Eigenvalue distributions of random matrices, the Marchenko-Pastur law, spectral algorithms for clustering and PCA, and free probability.

**23. Kernel Methods and Reproducing Kernel Hilbert Spaces**
The kernel trick, Mercer's theorem, RKHSs, SVMs, Gaussian processes, and the functional-analytic view of nonparametric learning.

**24. Sparse Methods and Compressed Sensing**
Sparsity-inducing norms, LASSO, restricted isometry property, basis pursuit, and recovery guarantees for underdetermined systems.

### Dynamical Systems and Control

**25. Dynamical Systems and Stability Analysis**
ODEs, fixed points, Lyapunov stability, attractors, bifurcations, and connections to gradient flow and optimization dynamics.

**26. Optimal Control and Hamilton-Jacobi Theory**
The Bellman principle, Hamilton-Jacobi-Bellman equations, Pontryagin's maximum principle, and continuous-time optimal control.

### Matrix and Tensor Methods

**27. Matrix Factorization and Tensor Decomposition**
NMF, PCA, ICA, CP/Tucker decompositions, tensor networks, and their applications in dimensionality reduction and latent factor models.

**28. Differential Geometry and Manifold Learning**
Riemannian manifolds, geodesics, the exponential map, parallel transport, information geometry, and manifold-based dimensionality reduction.

### Game Theory and Causality

**29. Game Theory and Mechanism Design**
Nash equilibria, zero-sum games, correlated equilibria, auction theory, and connections to adversarial training and multi-agent learning.

**30. Causal Inference and Potential Outcomes**
The Rubin causal model, average treatment effects, propensity scores, instrumental variables, and observational study design.

**31. Structural Causal Models and Do-Calculus**
Pearl's causal hierarchy, interventional distributions, the do-operator, identifiability, and front-door/back-door criteria.

### Safety and Expressiveness

**32. Differential Privacy and Formal Guarantees**
The ($\varepsilon$, $\delta$)-DP definition, the Gaussian and Laplace mechanisms, composition theorems, and privacy-utility tradeoffs in ML.

**33. Expressive Power, Universality, and Approximation Theory**
Universal approximation theorems, depth-width tradeoffs, circuit complexity of neural networks, and the theoretical limits of function approximation.

---

## Pillar II — Frontiers in AI and Machine Learning

*The cutting edge. What the field is building.*

This pillar maps the major algorithmic developments in modern AI — from the foundational deep learning toolkit through generative models, reinforcement learning, interpretability, and the emerging paradigms shaping the next decade of research.

### Deep Learning Fundamentals

**1. Deep Learning Fundamentals**
Feedforward networks, backpropagation, activation functions, weight initialization, batch normalization, dropout, and the practical mechanics of training deep models.

**2. Convolutional Networks**
Convolution and pooling operations, translation equivariance, ResNets, EfficientNets, and the architectural lineage of vision models.

**3. Recurrent Networks and LSTMs**
Vanilla RNNs, vanishing gradients, LSTMs, GRUs, bidirectional networks, and sequence modeling before the transformer era.

**4. Attention Mechanisms and Transformers**
Scaled dot-product attention, multi-head attention, positional encodings, the encoder-decoder architecture, and the transformer as a universal sequence model.

### Large-Scale and Foundation Models

**5. Large Language Models**
Autoregressive language modeling, tokenization, scaling behavior, instruction tuning, RLHF, and the capabilities and failure modes of large-scale LLMs.

**6. Foundation Models and Pretraining**
The pretrain-finetune paradigm, transfer learning, BERT/GPT pretraining objectives, contrastive pretraining, and the emergence of general-purpose representations.

**7. Self-Supervised Learning**
Predictive, contrastive, and generative self-supervision; masked autoencoders; DINO; and learning without human labels.

**8. Contrastive and Representation Learning**
InfoNCE, SimCLR, MoCo, CLIP, and the geometry of learned embedding spaces.

### Generative Models

**9. Variational Autoencoders**
The ELBO as a training objective, the reparameterization trick, disentangled representations, and hierarchical VAEs.

**10. Generative Adversarial Networks**
The minimax game, mode collapse, Wasserstein GANs, progressive growing, StyleGAN, and the GAN training dynamics.

**11. Normalizing Flows**
Change-of-variables formula, coupling layers, autoregressive flows, continuous normalizing flows, and exact likelihood estimation.

**12. Score-Based and Diffusion Models**
Denoising score matching, the diffusion forward process, DDPM, DDIM, classifier-free guidance, and the connection to stochastic differential equations.

### Reinforcement Learning

**13. Reinforcement Learning Fundamentals**
MDPs, the Bellman equations, dynamic programming, Q-learning, SARSA, and the exploration-exploitation dilemma.

**14. Deep Policy Gradient Methods**
REINFORCE, the policy gradient theorem, variance reduction with baselines, and the landscape of on-policy deep RL.

**15. Actor-Critic and Trust Region Methods**
A3C/A2C, PPO, TRPO, and the trust region framework for stable policy optimization.

**16. Model-Based RL and Planning**
Dyna architecture, world models, AlphaZero-style MCTS, and leveraging learned environment models for sample efficiency.

**17. World Models and JEPA**
Latent dynamics models, dreamer, joint embedding predictive architectures, and the architecture of anticipatory intelligence.

**18. Multi-Agent RL**
Cooperative and competitive settings, centralized training with decentralized execution, MARL algorithms, and emergent communication.

### Adaptation and Meta-Learning

**19. Continual Learning and Catastrophic Forgetting**
Elastic weight consolidation, progressive networks, replay methods, and the problem of learning sequentially without forgetting.

**20. Meta-Learning and Few-Shot Learning**
MAML, Prototypical Networks, learning-to-learn, and the inductive biases that enable fast adaptation from scarce data.

### Causality, Interpretability, and Alignment

**21. Causal Representation Learning**
Learning representations that respect causal structure, identifiable latent variable models, and connections between causal and distributional robustness.

**22. Mechanistic Interpretability**
Circuits, superposition, sparse autoencoders, feature visualization, and reverse-engineering the internal computations of neural networks.

**23. AI Alignment and Safety**
Reward misspecification, Goodhart's law, scalable oversight, interpretability for safety, and the technical alignment research agenda.

### Multimodal and Structured Models

**24. Multimodal and Vision-Language Models**
CLIP, Flamingo, GPT-4V, image-text alignment, cross-modal attention, and the challenge of grounding language in perception.

**25. Graph Neural Networks**
Message passing, GCNs, GATs, graph transformers, over-smoothing, and applications to molecular, social, and knowledge graph data.

**26. Geometric Deep Learning**
Equivariance and invariance, group-theoretic foundations, SE(3)-equivariant networks, and the geometric framework unifying many architectures.

**27. Neural ODEs and Scientific ML**
Continuous-depth networks, adjoint sensitivity method, physics-informed neural networks, and neural operators for learning PDEs.

### Embodied and Agentic AI

**28. Embodied AI and Robotics**
Sim-to-real transfer, imitation learning, manipulation policies, and the challenge of learning from physical interaction.

**29. Agentic AI Systems and Tool Use**
LLM agents, ReAct, tool-augmented generation, memory architectures, and multi-step reasoning systems.

**30. Emergent Capabilities and Scaling Laws**
Chinchilla scaling laws, emergent abilities, phase transitions in model capability, and the empirical science of large-scale training.

---

## Pillar III — Computing and Engineering for ML

*The craft. Making it actually run.*

This pillar covers the systems knowledge required to train and deploy large-scale ML models: from GPU architecture and CUDA programming through distributed training strategies, inference optimization, and the full MLOps lifecycle.

### Hardware and Low-Level Programming

**1. GPU Architecture and CUDA Programming**
SIMT execution model, warp scheduling, memory hierarchy (global/shared/registers), CUDA kernels, and performance optimization patterns.

**2. Distributed Training: Data Parallelism**
DDP, gradient synchronization with all-reduce, ring-allreduce, ZeRO optimizer stages, and scaling to hundreds of GPUs.

**3. Distributed Training: Model and Pipeline Parallelism**
Tensor parallelism, pipeline parallelism with micro-batching, Megatron-LM strategies, and the tradeoffs between parallelism dimensions.

**4. Mixed Precision and Quantization**
FP16/BF16 training, loss scaling, post-training quantization, QAT, GPTQ, AWQ, and the accuracy-efficiency frontier.

**5. Memory Optimization and Gradient Checkpointing**
Activation recomputation, optimizer state offloading, memory-efficient attention (FlashAttention), and strategies for fitting large models into limited memory.

### Compilers and Autodiff

**6. ML Compilers: XLA, Triton, TVM**
Computation graphs, operator fusion, loop tiling, the XLA HLO IR, Triton DSL for custom GPU kernels, and compiler-driven performance.

**7. Automatic Differentiation and Tape Systems**
Forward and reverse mode AD, Wengert tapes, JAX's functional transforms (jit, grad, vmap), and the design of modern AD systems.

### Inference and Serving

**8. Inference Serving and Optimization**
Batching strategies, KV-cache management, continuous batching, speculative decoding, and the systems design of LLM inference at scale.

**9. Profiling and Performance Analysis**
NVIDIA Nsight, PyTorch Profiler, roofline model analysis, memory bandwidth vs. compute bound characterization, and optimization methodology.

**10. Fault Tolerance and Checkpointing**
Elastic training, checkpoint-restart strategies, detection and recovery from hardware failures in long-running distributed jobs.

**11. Hardware Accelerators: TPU, IPU, and Beyond**
Google TPU architecture and XLA integration, Graphcore IPU, Cerebras WSE, and the landscape of purpose-built ML accelerators.

**12. Networking for Distributed ML: NCCL, InfiniBand**
Collective communication primitives (allreduce, allgather, broadcast), NCCL tuning, RDMA over InfiniBand, and network topology effects on training throughput.

### Data, Pipelines, and MLOps

**13. Data Engineering and Feature Pipelines**
Dataset formats (TFRecords, Parquet, WebDataset), data loaders, preprocessing pipelines, online vs. offline feature computation, and data quality at scale.

**14. MLOps and Experiment Tracking**
Weights & Biases, MLflow, reproducible experiment management, hyperparameter sweep strategies, and the operational practices of ML teams.

**15. Model Registries and Deployment**
Model versioning, A/B testing, canary deployments, serving infrastructure (Triton, TorchServe), and the model lifecycle from training to production.

**16. Edge ML and Model Compression**
Knowledge distillation, structured pruning, Neural Architecture Search for efficient models, CoreML/TFLite deployment, and on-device inference constraints.

**17. Green AI and Compute Efficiency**
Carbon accounting for ML training, FLOPs-performance tradeoffs, efficient architecture design, and the environmental responsibility of large-scale ML.

**18. Training Frameworks and Infrastructure**
PyTorch, JAX/Flax, DeepSpeed, FSDP, Kubernetes for ML, and the evolving stack for training frontier models.

---

*Last updated: 2026-03-13 · 81 topics · 3 pillars*
