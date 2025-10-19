/**
 * Byzantine Fault-Tolerant Consensus
 * Implements Practical Byzantine Fault Tolerance (pBFT) consensus protocol
 */

export class ByzantineConsensus {
  constructor(coordinator, config = {}) {
    this.coordinator = coordinator;
    this.config = {
      threshold: config.threshold || 0.67, // 2f+1 where f is max faulty nodes
      timeoutMs: config.timeoutMs || 5000,
      viewChangeTimeout: config.viewChangeTimeout || 10000,
      ...config
    };

    this.proposals = new Map();
    this.votes = new Map();
    this.decisions = new Map();
    this.viewNumber = 0;
    this.isPrimary = false;
    this.sequenceNumber = 0;
  }

  /**
   * Propose a new decision for consensus
   */
  async propose(proposal) {
    const proposalId = this.generateProposalId();

    console.log(`[Consensus] Proposing decision: ${proposalId}`);

    const consensusProposal = {
      id: proposalId,
      proposal,
      viewNumber: this.viewNumber,
      sequenceNumber: ++this.sequenceNumber,
      timestamp: Date.now(),
      phase: 'pre-prepare',
      votes: new Map(),
      prepareMessages: new Set(),
      commitMessages: new Set()
    };

    this.proposals.set(proposalId, consensusProposal);

    // Broadcast pre-prepare message
    await this.broadcastPrePrepare(consensusProposal);

    // Wait for consensus
    return await this.waitForConsensus(proposalId);
  }

  /**
   * Broadcast pre-prepare message (Primary node)
   */
  async broadcastPrePrepare(proposal) {
    const message = {
      type: 'consensus_proposal',
      data: {
        phase: 'pre-prepare',
        proposalId: proposal.id,
        proposal: proposal.proposal,
        viewNumber: proposal.viewNumber,
        sequenceNumber: proposal.sequenceNumber,
        timestamp: proposal.timestamp
      }
    };

    await this.coordinator.broadcast(message);
  }

  /**
   * Handle incoming consensus proposal
   */
  async handleProposal(fromPeerId, data) {
    const { phase, proposalId, proposal, viewNumber, sequenceNumber } = data;

    if (phase === 'pre-prepare') {
      await this.handlePrePrepare(fromPeerId, data);
    } else if (phase === 'prepare') {
      await this.handlePrepare(fromPeerId, data);
    } else if (phase === 'commit') {
      await this.handleCommit(fromPeerId, data);
    }
  }

  /**
   * Handle pre-prepare phase
   */
  async handlePrePrepare(fromPeerId, data) {
    const { proposalId, proposal, viewNumber, sequenceNumber } = data;

    console.log(`[Consensus] Received pre-prepare for ${proposalId} from ${fromPeerId}`);

    // Verify proposal
    if (!this.verifyProposal(data)) {
      console.warn(`[Consensus] Invalid proposal ${proposalId}`);
      return;
    }

    // Store proposal
    if (!this.proposals.has(proposalId)) {
      this.proposals.set(proposalId, {
        id: proposalId,
        proposal,
        viewNumber,
        sequenceNumber,
        timestamp: Date.now(),
        phase: 'prepare',
        votes: new Map(),
        prepareMessages: new Set(),
        commitMessages: new Set()
      });
    }

    // Send prepare message
    await this.sendPrepare(proposalId);
  }

  /**
   * Send prepare message
   */
  async sendPrepare(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return;

    const message = {
      type: 'consensus_proposal',
      data: {
        phase: 'prepare',
        proposalId,
        viewNumber: proposal.viewNumber,
        sequenceNumber: proposal.sequenceNumber,
        nodeId: this.coordinator.nodeId
      }
    };

    await this.coordinator.broadcast(message);
    proposal.phase = 'prepare';
  }

  /**
   * Handle prepare phase
   */
  async handlePrepare(fromPeerId, data) {
    const { proposalId, nodeId } = data;
    const proposal = this.proposals.get(proposalId);

    if (!proposal) {
      console.warn(`[Consensus] Unknown proposal ${proposalId}`);
      return;
    }

    console.log(`[Consensus] Received prepare for ${proposalId} from ${fromPeerId}`);

    // Record prepare message
    proposal.prepareMessages.add(nodeId || fromPeerId);

    // Check if we have enough prepare messages (2f+1)
    const quorumSize = this.calculateQuorumSize();
    if (proposal.prepareMessages.size >= quorumSize && proposal.phase === 'prepare') {
      await this.sendCommit(proposalId);
    }
  }

  /**
   * Send commit message
   */
  async sendCommit(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return;

    const message = {
      type: 'consensus_proposal',
      data: {
        phase: 'commit',
        proposalId,
        viewNumber: proposal.viewNumber,
        sequenceNumber: proposal.sequenceNumber,
        nodeId: this.coordinator.nodeId
      }
    };

    await this.coordinator.broadcast(message);
    proposal.phase = 'commit';
  }

  /**
   * Handle commit phase
   */
  async handleCommit(fromPeerId, data) {
    const { proposalId, nodeId } = data;
    const proposal = this.proposals.get(proposalId);

    if (!proposal) {
      console.warn(`[Consensus] Unknown proposal ${proposalId}`);
      return;
    }

    console.log(`[Consensus] Received commit for ${proposalId} from ${fromPeerId}`);

    // Record commit message
    proposal.commitMessages.add(nodeId || fromPeerId);

    // Check if we have enough commit messages (2f+1)
    const quorumSize = this.calculateQuorumSize();
    if (proposal.commitMessages.size >= quorumSize && proposal.phase === 'commit') {
      await this.executeDecision(proposalId);
    }
  }

  /**
   * Execute consensus decision
   */
  async executeDecision(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return;

    console.log(`[Consensus] Executing decision for ${proposalId}`);

    const decision = {
      proposalId,
      proposal: proposal.proposal,
      approved: true,
      timestamp: Date.now(),
      participants: proposal.commitMessages.size
    };

    this.decisions.set(proposalId, decision);
    proposal.phase = 'executed';

    this.coordinator.emit('consensus_reached', decision);
  }

  /**
   * Handle incoming vote
   */
  async handleVote(fromPeerId, data) {
    const { proposalId, vote, signature } = data;

    if (!this.verifyVote(fromPeerId, vote, signature)) {
      console.warn(`[Consensus] Invalid vote from ${fromPeerId}`);
      return;
    }

    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      console.warn(`[Consensus] Vote for unknown proposal ${proposalId}`);
      return;
    }

    // Record vote
    if (!this.votes.has(proposalId)) {
      this.votes.set(proposalId, new Map());
    }

    this.votes.get(proposalId).set(fromPeerId, {
      vote,
      timestamp: Date.now(),
      signature
    });

    // Check if consensus reached
    await this.checkConsensus(proposalId);
  }

  /**
   * Check if consensus has been reached
   */
  async checkConsensus(proposalId) {
    const proposal = this.proposals.get(proposalId);
    const votes = this.votes.get(proposalId);

    if (!proposal || !votes) return;

    const totalVotes = votes.size;
    const approveVotes = Array.from(votes.values())
      .filter(v => v.vote === 'approve').length;

    const threshold = this.calculateQuorumSize();

    if (approveVotes >= threshold) {
      console.log(`[Consensus] Consensus reached for ${proposalId}`);

      const decision = {
        proposalId,
        proposal: proposal.proposal,
        approved: true,
        votes: totalVotes,
        approvals: approveVotes,
        timestamp: Date.now()
      };

      this.decisions.set(proposalId, decision);
      this.coordinator.emit('consensus_reached', decision);
    }
  }

  /**
   * Wait for consensus to be reached
   */
  async waitForConsensus(proposalId, timeoutMs = this.config.timeoutMs) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Consensus timeout for proposal ${proposalId}`));
      }, timeoutMs);

      const checkDecision = () => {
        if (this.decisions.has(proposalId)) {
          clearTimeout(timeout);
          resolve(this.decisions.get(proposalId));
        } else {
          setTimeout(checkDecision, 100);
        }
      };

      checkDecision();
    });
  }

  /**
   * Calculate quorum size (2f+1)
   */
  calculateQuorumSize() {
    const totalNodes = this.coordinator.peers.size + 1; // +1 for self
    const f = Math.floor((totalNodes - 1) / 3); // max faulty nodes
    return 2 * f + 1;
  }

  /**
   * Verify proposal validity
   */
  verifyProposal(data) {
    // Basic validation - could add cryptographic verification
    return data.proposalId && data.proposal && data.viewNumber !== undefined;
  }

  /**
   * Verify vote validity
   */
  verifyVote(peerId, vote, signature) {
    // Placeholder - would implement cryptographic signature verification
    return vote && ['approve', 'reject'].includes(vote);
  }

  /**
   * Generate unique proposal ID
   */
  generateProposalId() {
    return `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get consensus status
   */
  getStatus() {
    return {
      viewNumber: this.viewNumber,
      isPrimary: this.isPrimary,
      sequenceNumber: this.sequenceNumber,
      activeProposals: this.proposals.size,
      decisions: this.decisions.size,
      quorumSize: this.calculateQuorumSize()
    };
  }
}
