import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const PagePanel = styled.section<{ $narrow?: boolean }>`
  box-sizing: border-box;
  max-width: ${({ $narrow }) => ($narrow ? '620px' : '860px')};
  margin: 0 auto;
  padding: 56px 32px;
  text-align: left;

  @media (max-width: 640px) {
    padding: 32px 16px;
  }
`

export const Eyebrow = styled.p`
  color: var(--accent);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

export const Status = styled.p<{ $error?: boolean }>`
  max-width: 760px;
  margin: 0 auto;
  padding: 18px 20px;
  border: 1px solid ${({ $error }) => ($error ? 'rgba(180, 35, 24, 0.4)' : 'var(--border)')};
  border-radius: 12px;
  color: ${({ $error }) => ($error ? '#b42318' : 'inherit')};
  background: ${({ $error }) => ($error ? 'rgba(180, 35, 24, 0.08)' : 'var(--social-bg)')};
  text-align: center;
`

export const PostFormContainer = styled.form`
  display: grid;
  gap: 18px;
  margin-top: 28px;
`

export const FormField = styled.label`
  display: grid;
  gap: 8px;
  color: var(--text-h);
  font-size: 15px;
  font-weight: 700;

  input,
  textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text-h);
    background: var(--bg);
    font: inherit;
  }

  input:focus,
  textarea:focus {
    border-color: var(--accent-border);
    outline: 3px solid var(--accent-bg);
  }

  textarea {
    resize: vertical;
  }
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const interactiveStyles = `
  align-items: center;
  border-radius: 999px;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  justify-content: center;
  min-height: 42px;
  padding: 10px 16px;
  text-decoration: none;
`

export const PrimaryButton = styled.button`
  ${interactiveStyles}
  border: 1px solid var(--accent);
  color: white;
  background: var(--accent);

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`

export const SecondaryButton = styled.button`
  ${interactiveStyles}
  border: 1px solid var(--border);
  color: var(--text-h);
  background: var(--social-bg);
`

export const DangerButton = styled.button`
  ${interactiveStyles}
  border: 1px solid rgba(180, 35, 24, 0.4);
  color: #b42318;
  background: rgba(180, 35, 24, 0.08);
`

export const PrimaryLink = styled(Link)`
  ${interactiveStyles}
  border: 1px solid var(--accent);
  color: white;
  background: var(--accent);
`

export const SecondaryLink = styled(Link)`
  ${interactiveStyles}
  border: 1px solid var(--border);
  color: var(--text-h);
  background: var(--social-bg);
`
