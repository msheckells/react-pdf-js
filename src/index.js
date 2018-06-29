/**
 * @class ReactPdfJs
 */
import PdfJsLib from 'pdfjs-dist';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class ReactPdfJs extends Component {
  static propTypes = {
    file: PropTypes.string.isRequired,
    page: PropTypes.number,
    scale: PropTypes.number,
    onDocumentComplete: PropTypes.func,
  }

  static defaultProps = {
    page: 1,
    scale: 1.5,
    onDocumentComplete: null,
  }

  state = {
    pdf: null,
  };

  componentDidMount() {
    PdfJsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.550/pdf.worker.js';
    PdfJsLib.getDocument(this.props.file).then((pdf) => {
      this.setState({ pdf });
      if (this.props.onDocumentComplete) {
        this.props.onDocumentComplete(pdf.pdfInfo.numPages);
      }
      pdf.getPage(this.props.page).then((page) => {
        const viewport = page.getViewport(this.props.scale);

        const { canvas } = this;
        const canvasContext = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext,
          viewport,
        };
        page.render(renderContext);
      });
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.page !== this.props.page) {
      this.state.pdf.getPage(newProps.page).then((page) => {
        const viewport = page.getViewport(this.props.scale);

        const { canvas } = this;
        const canvasContext = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext,
          viewport,
        };
        page.render(renderContext);
      });
    }
  }

  render() {
    return <canvas ref={(canvas) => { this.canvas = canvas; }} />;
  }
}
