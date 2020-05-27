import React from "react"

import Highlight, { defaultProps } from "prism-react-renderer"
import codeTheme from "../code-theme"
import { MDXProvider } from "@mdx-js/react"

function pre({ children: { props } }) {
  const lang = props.className && props.className.split("-")[1]

  return (
    <div
      style={{
        width: "100% !important",
        marginBottom: "1.5rem",
        overflowX: "auto",
        "& pre": {
          overflowX: "auto",
          width: "100%",
          padding: 16,
        },
      }}
    >
      <Highlight
        {...defaultProps}
        theme={codeTheme}
        code={props.children.trim()}
        language={lang}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} css={{ marginBottom: 0 }} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

const components = { pre }

function Main({ children }) {
  return (
    <main
      style={{
        margin: `0 auto`,
        width: "65%",
        padding: `0 1.0875rem 1.45rem`,
      }}
    >
      <MDXProvider components={components}>{children}</MDXProvider>
    </main>
  )
}

export default Main
