export interface ActionInupts {
  token: string
  reginaldfilePath: string
  reginaldId: string
}

export const getActionInputs: (getInput: (name: string) => string) => ActionInupts = (getInput) => {
  const token = getInput('repo-token');
  const reginaldfilePath = getInput('file-path')
  const reginaldId = getInput('reginald-id')

  return { token, reginaldfilePath, reginaldId }
}