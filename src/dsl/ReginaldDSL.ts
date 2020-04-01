import {GitDSL} from '.'
import {PullRequestDSL} from './PullRequestDSL'

export interface ReginaldDSL {
  message: (body: string) => void
  warning: (body: string) => void
  error: (body: string) => void
  pr: PullRequestDSL
  git: GitDSL
}
