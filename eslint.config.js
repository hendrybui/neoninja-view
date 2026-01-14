// eslint.config.js - NeoNinja View v1.2
export default [
  {
    files: ["main.js", "src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        // Node.js globals for main process
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        global: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
        
        // Browser globals for renderer process
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        location: "readonly",
        history: "readonly",
        fetch: "readonly",
        XMLHttpRequest: "readonly",
        WebSocket: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        alert: "readonly",
        confirm: "readonly",
        prompt: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Image: "readonly",
        Audio: "readonly",
        Video: "readonly",
        Canvas: "readonly",
        HTMLElement: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        MutationObserver: "readonly",
        IntersectionObserver: "readonly",
        ResizeObserver: "readonly",
        
        // Electron specific
        electron: "readonly"
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    rules: {
      // Possible Problems
      "no-console": "off",
      "no-debugger": "warn",
      "no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_" 
      }],
      "no-undef": "error",
      
      // Suggestions
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "warn",
      "prefer-template": "warn",
      
      // Layout & Formatting
      "indent": ["warn", 2, { "SwitchCase": 1 }],
      "quotes": ["warn", "single", { "avoidEscape": true }],
      "semi": ["warn", "always"],
      "comma-dangle": ["warn", "never"],
      "no-trailing-spaces": "warn",
      "eol-last": "warn",
      
      // Best Practices
      "eqeqeq": ["warn", "always"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-return-await": "warn",
      "require-await": "warn",
      
      // Security
      "no-script-url": "error",
      
      // Code Quality
      "complexity": ["warn", 15],
      "max-depth": ["warn", 4],
      "max-nested-callbacks": ["warn", 4],
      "max-params": ["warn", 5],
      "max-statements": ["warn", 30]
    }
  }
];
