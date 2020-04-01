import {GitHub} from '@actions/github'

// Workaround to get an octokit response type
// https://github.com/octokit/types.ts/issues/25#issuecomment-602106961
type Unwrap<T> = T extends Promise<infer U> ? U : T
type PullsGetResponse = Unwrap<
  ReturnType<InstanceType<typeof GitHub>['pulls']['get']>
>['data']

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PullRequestDSL extends PullsGetResponse {}
