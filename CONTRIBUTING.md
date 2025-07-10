# 🤝 Contributing to n8n Workflow Directory

Thank you for considering contributing to the n8n Workflow Directory! We welcome contributions from the community and appreciate your help in making this project better.

## 🌟 How to Contribute

### 🐛 Bug Reports

If you find a bug, please create an issue with:
- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Browser/OS information** if relevant
- **Screenshots** if applicable

### 💡 Feature Requests

We'd love to hear your ideas! Please create an issue with:
- **Clear description** of the feature
- **Use case** - why would this be useful?
- **Mockups or examples** if applicable
- **Implementation ideas** if you have them

### 🔧 Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/yourusername/n8n-workflow-directory.git`
3. **Install dependencies**: `npm install`
4. **Start development**: `npm run dev`

#### Making Changes

1. **Create a feature branch**: `git checkout -b feature/your-feature-name`
2. **Make your changes**
3. **Test thoroughly**
4. **Commit with descriptive messages**
5. **Push to your fork**: `git push origin feature/your-feature-name`
6. **Create a Pull Request**

#### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled by Prettier
- **Naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic

#### Testing

- **Manual Testing**: Test your changes in the browser
- **Cross-browser**: Test on different browsers if possible
- **Responsive**: Test on different screen sizes
- **Performance**: Ensure changes don't significantly impact performance

## 🎨 Design Contributions

We welcome design improvements! Please:
- **Follow the existing design system**
- **Consider accessibility** (WCAG guidelines)
- **Provide Figma files** or design mockups when possible
- **Test on different devices** and screen sizes

## 📝 Documentation

Help us improve documentation by:
- **Fixing typos** and grammatical errors
- **Adding examples** and use cases
- **Improving clarity** of explanations
- **Creating tutorials** or guides

## 🚀 Development Guidelines

### Project Structure

```
src/
├── components/          # React components
├── utils/              # Utility functions
├── data/               # Data files and processing
├── types/              # TypeScript type definitions
└── styles/             # CSS and styling
```

### Key Technologies

- **React 19** with TypeScript
- **Vite** for building
- **Tailwind CSS** for styling
- **React Flow** for workflow visualization
- **Dagre** for automatic layout

### Performance Considerations

- **Bundle size**: Keep bundle size reasonable
- **Lazy loading**: Use lazy loading for large components
- **Memoization**: Use React.memo and useMemo where appropriate
- **Virtual scrolling**: Consider for large lists

## 🔒 Security

- **No sensitive data**: Don't commit API keys or sensitive information
- **Input validation**: Validate all user inputs
- **XSS prevention**: Sanitize any user-generated content
- **Dependencies**: Keep dependencies up to date

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤔 Questions?

If you have questions about contributing, please:
- **Check existing issues** for similar questions
- **Create a new issue** with the "question" label
- **Reach out** via email: guy@guyc.dev

## 🎉 Recognition

All contributors will be recognized in the project! We appreciate every contribution, no matter how small.

---

Thank you for helping make the n8n Workflow Directory better! 🚀