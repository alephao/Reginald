import * as Webhooks from '@octokit/webhooks'
import { GitDSL } from './GitDSL'

export interface ReginaldDSL {
  message: (body: string) => void
  warning: (body: string) => void
  error: (body: string) => void
  pr: Webhooks.WebhookPayloadPullRequestPullRequest
  git: GitDSL
}
