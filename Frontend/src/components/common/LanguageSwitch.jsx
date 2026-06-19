"use client"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

const LanguageSwitch = () => {
  const { i18n } = useTranslation()
  const isHindi = i18n.language === "hi"

  const handleToggle = () => {
    const newLang = isHindi ? "en" : "hi"
    i18n.changeLanguage(newLang)
  }

  return (
    <StyledWrapper>
      <label className="switch-button" htmlFor="language-switch">
        <div className="switch-outer">
          <input id="language-switch" type="checkbox" checked={isHindi} onChange={handleToggle} />
          <div className="button">
            <span className="button-toggle">
              <span className="language-text">{isHindi ? "हि" : "EN"}</span>
            </span>
            <span className="button-indicator" />
          </div>
        </div>
      </label>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .switch-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
  }

  .switch-button .switch-outer {
    height: 100%;
    background: #f3f4f6;
    width: 80px;
    border-radius: 20px;
    box-shadow: inset 0px 2px 4px 0px rgba(0,0,0,0.1);
    border: 1px solid #e5e7eb;
    padding: 4px;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .switch-button .switch-outer:hover {
    background: #e5e7eb;
  }

  .switch-button .switch-outer input[type="checkbox"] {
    opacity: 0;
    appearance: none;
    position: absolute;
  }

  .switch-button .switch-outer .button-toggle {
    height: 32px;
    width: 32px;
    background: linear-gradient(145deg, #ffffff, #f0f0f0);
    border-radius: 50%;
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
    position: relative;
    z-index: 2;
    transition: left 0.3s ease-in-out;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .language-text {
    font-size: 10px;
    font-weight: 600;
    color: #374151;
  }

  .switch-button .switch-outer input[type="checkbox"]:checked + .button .button-toggle {
    left: 44px;
  }

  .switch-button .switch-outer input[type="checkbox"]:checked + .button .button-indicator {
    animation: indicator 0.5s forwards;
  }

  .switch-button .switch-outer .button {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
  }

  .switch-button .switch-outer .button-indicator {
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background: #ef4444;
    position: absolute;
    right: 8px;
    transition: all 0.3s ease;
  }

  @keyframes indicator {
    0% {
      background: #ef4444;
      right: 8px;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      background: #10b981;
      right: 52px;
    }
  }
`

export default LanguageSwitch
