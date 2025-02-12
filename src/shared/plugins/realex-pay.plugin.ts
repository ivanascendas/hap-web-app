export const DEFAUT_HPP_TEST_URL = "https://pay.sandbox.realexpayments.com/pay";
export const DEFAUT_HPP_URL = "https://pay.realexpayments.com/pay";
const randomId = Math.random().toString(16).substring(2, 8);
const closeButtonImg =
  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUJFRjU1MEIzMUQ3MTFFNThGQjNERjg2NEZCRjFDOTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUJFRjU1MEMzMUQ3MTFFNThGQjNERjg2NEZCRjFDOTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQkVGNTUwOTMxRDcxMUU1OEZCM0RGODY0RkJGMUM5NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQkVGNTUwQTMxRDcxMUU1OEZCM0RGODY0RkJGMUM5NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlHco5QAAAHpSURBVHjafFRdTsJAEF42JaTKn4glGIg++qgX4AAchHAJkiZcwnAQD8AF4NFHCaC2VgWkIQQsfl/jNJUik8Duzs/XmW9mN7Xb7VRc5vP5zWKxaK5Wq8Zmu72FqobfJG0YQ9M0+/l8/qFQKDzGY1JxENd1288vLy1s786KRZXJZCLber1Wn7MZt4PLarVnWdZ9AmQ8Hncc17UvymVdBMB/MgPQm+cFFcuy6/V6lzqDf57ntWGwYdBIVx0TfkBD6I9M35iRJgfIoAVjBLDZbA4CiJ5+9AdQi/EahibqDTkQx6fRSIHcPwA8Uy9A9Gcc47Xv+w2wzhRDYzqdVihLIbsIiCvP1NNOoX/29FQx3vgOgtt4FyRdCgPRarX4+goB9vkyAMh443cOEsIAAcjncuoI4TXWMAmCIGFhCQLAdZ8jym/cRJ+Y5nC5XCYAhINKpZLgSISZgoqh5iiLQrojAFICVwGS7tCfe5DbZzkP56XS4NVxwvTI/vXVVYIDnqmnnX70ZxzjNS8THHooK5hMpxHQIREA+tEfA9djfHR3MHkdx3Hspe9r3B+VzWaj2RESyR2mlCUE4MoGQDdxiwHURq2t94+PO9bMIYyTyDNLwMoM7g8+BfKeYGniyw2MdfSehF3Qmk1IvCc/AgwAaS86Etp38bUAAAAASUVORK5CYII=";
const closeButtonStyle =
  "transition: all 0.5s ease-in-out; opacity: 0; float: left; position: absolute; left: 50%; margin-left: 173px; z-index: 99999999; top: 30px;";
const spinnerImg =
  "data:image/gif;base64,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";

class RealexHppUtils {
  private isWindowsMobileOs = /Windows Phone|IEMobile/.test(
    navigator.userAgent,
  );
  private isAndroidOrIOs = /Android|iPad|iPhone|iPod/.test(navigator.userAgent);

  private isMobileXS =
    ((window.innerWidth > 0 ? window.innerWidth : window.screen.width) <= 360
      ? true
      : false) ||
    ((window.innerHeight > 0 ? window.innerHeight : window.screen.height) <= 360
      ? true
      : false); // eslint-disable-line no-restricted-globals

  // Display IFrame on WIndows Phone OS mobile devices
  public isMobileIFrame = this.isWindowsMobileOs;

  // For IOs/Android and small screen devices always open in new tab/window
  public isMobileNewTab =
    !this.isWindowsMobileOs && (this.isAndroidOrIOs || this.isMobileXS);
  public tabWindow: Window | null = null;

  public redirectUrl = "";
  public hppUrl: string = DEFAUT_HPP_TEST_URL;

  constructor() {}

  createFormHiddenInput(name: string, value: string): HTMLInputElement {
    const el = document.createElement("input");
    el.setAttribute("type", "hidden");
    el.setAttribute("name", name);
    el.setAttribute("value", value);
    return el;
  }

  checkDevicesOrientation(): boolean {
    return (
      window.screen.orientation.angle === 90 ||
      window.screen.orientation.angle === -90
    );
  }

  createOverlay(): HTMLDivElement {
    const overlay = document.createElement("div");
    overlay.setAttribute("id", "rxp-overlay-" + randomId);
    overlay.style.position = "fixed";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.transition = "all 0.3s ease-in-out";
    overlay.style.zIndex = "100";

    if (this.isMobileIFrame) {
      overlay.style.position = "absolute !important";
      (overlay.style as any).WebkitOverflowScrolling = "touch";
      overlay.style.overflowX = "hidden";
      overlay.style.overflowY = "scroll";
    }

    document.body.appendChild(overlay);

    setTimeout(function () {
      overlay.style.background = "rgba(0, 0, 0, 0.7)";
    }, 1);

    return overlay;
  }

  closeModal(
    closeButton?: HTMLElement,
    iFrame?: HTMLElement,
    spinner?: HTMLElement,
    overlayElement?: HTMLElement,
  ): void {
    if (closeButton && closeButton.parentNode) {
      closeButton.parentNode.removeChild(closeButton);
    }

    if (iFrame && iFrame.parentNode) {
      iFrame.parentNode.removeChild(iFrame);
    }

    if (spinner && spinner.parentNode) {
      spinner.parentNode.removeChild(spinner);
    }

    if (!overlayElement) {
      return;
    }

    overlayElement.className = "";
    setTimeout(function () {
      if (overlayElement.parentNode) {
        overlayElement.parentNode.removeChild(overlayElement);
      }
    }, 300);
  }

  createCloseButton(): HTMLImageElement | undefined {
    if (document.getElementById("rxp-frame-close-" + randomId) !== null) {
      return;
    }

    const closeButton = document.createElement("img");
    closeButton.setAttribute("id", "rxp-frame-close-" + randomId);
    closeButton.setAttribute("src", closeButtonImg);
    closeButton.setAttribute("style", closeButtonStyle);

    setTimeout(function () {
      closeButton.style.opacity = "1";
    }, 500);

    if (this.isMobileIFrame) {
      closeButton.style.position = "absolute";
      closeButton.style.float = "right";
      closeButton.style.top = "20px";
      closeButton.style.left = "initial";
      closeButton.style.marginLeft = "0px";
      closeButton.style.right = "20px";
    }

    return closeButton;
  }

  createForm(
    doc: Document,
    token: any,
    ignorePostMessage?: boolean,
  ): HTMLFormElement {
    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", this.hppUrl);

    for (const key in token) {
      form.appendChild(this.createFormHiddenInput(key, token[key]));
    }

    form.appendChild(this.createFormHiddenInput("HPP_VERSION", "2"));

    if (ignorePostMessage && this.redirectUrl) {
      form.appendChild(
        this.createFormHiddenInput("MERCHANT_RESPONSE_URL", this.redirectUrl),
      );
    } else {
      const parser = new URL(window.location.href);
      const hppOriginParam = parser.protocol + "//" + parser.host;

      form.appendChild(
        this.createFormHiddenInput("HPP_POST_RESPONSE", hppOriginParam),
      );
      form.appendChild(
        this.createFormHiddenInput("HPP_POST_DIMENSIONS", hppOriginParam),
      );
    }
    return form;
  }

  createSpinner(): HTMLImageElement {
    const spinner = document.createElement("img");
    spinner.setAttribute("src", spinnerImg);
    spinner.setAttribute("id", "rxp-loader-" + randomId);
    spinner.style.left = "50%";
    spinner.style.position = "fixed";
    spinner.style.background = "#FFFFFF";
    spinner.style.borderRadius = "50%";
    spinner.style.width = "30px";
    spinner.style.zIndex = "200";
    spinner.style.marginLeft = "-15px";
    spinner.style.top = "120px";
    return spinner;
  }

  createIFrame(
    overlayElement: HTMLElement,
    token: any,
  ): {
    spinner: HTMLImageElement;
    iFrame: HTMLIFrameElement;
    closeButton: HTMLImageElement | undefined;
  } {
    //Create the spinner
    const spinner = this.createSpinner();
    document.body.appendChild(spinner);

    //Create the iframe
    const iFrame = document.createElement("iframe");
    iFrame.setAttribute("name", "rxp-frame-" + randomId);
    iFrame.setAttribute("id", "rxp-frame-" + randomId);
    iFrame.setAttribute("height", "562px");
    iFrame.setAttribute("frameBorder", "0");
    iFrame.setAttribute("width", "360px");
    iFrame.setAttribute("seamless", "seamless");

    iFrame.style.zIndex = "10001";
    iFrame.style.position = "absolute";
    iFrame.style.transition = "transform 0.5s ease-in-out";
    iFrame.style.transform = "scale(0.7)";
    iFrame.style.opacity = "0";

    overlayElement.appendChild(iFrame);

    if (this.isMobileIFrame) {
      iFrame.style.top = "0px";
      iFrame.style.bottom = "0px";
      iFrame.style.left = "0px";
      iFrame.style.marginLeft = "0px;";
      iFrame.style.width = "100%";
      iFrame.style.height = "100%";
      iFrame.style.minHeight = "100%";
      (iFrame.style as any).WebkitTransform = "translate3d(0,0,0)";
      iFrame.style.transform = "translate3d(0, 0, 0)";

      const metaTag = document.createElement("meta");
      metaTag.name = "viewport";
      metaTag.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
      document.getElementsByTagName("head")[0].appendChild(metaTag);
    } else {
      iFrame.style.top = "40px";
      iFrame.style.left = "50%";
      iFrame.style.marginLeft = "-180px";
    }

    let closeButton: HTMLImageElement | undefined;

    iFrame.onload = () => {
      iFrame.style.opacity = "1";
      iFrame.style.transform = "scale(1)";
      iFrame.style.backgroundColor = "#ffffff";

      if (spinner.parentNode) {
        spinner.parentNode.removeChild(spinner);
      }

      closeButton = this.createCloseButton();
      if (closeButton) {
        overlayElement.appendChild(closeButton);
        closeButton.addEventListener(
          "click",
          () => {
            this.closeModal(closeButton, iFrame, spinner, overlayElement);
          },
          true,
        );
      }
    };

    const form = this.createForm(document, token);
    if (iFrame.contentWindow?.document.body) {
      iFrame.contentWindow?.document.body.appendChild(form);
    } else {
      iFrame.contentWindow?.document.appendChild(form);
    }

    form.submit();

    return {
      spinner: spinner,
      iFrame: iFrame,
      closeButton: closeButton,
    };
  }

  openWindow(token: any): Window | null {
    //open new window
    this.tabWindow = window.open();

    // browsers can prevent a new window from being created
    // e.g. mobile Safari
    if (!this.tabWindow) {
      return null;
    }

    const doc = this.tabWindow.document;

    //add meta tag to new window (needed for iOS 8 bug)
    const meta = doc.createElement("meta");
    const name = doc.createAttribute("name");
    name.value = "viewport";
    meta.setAttributeNode(name);
    const content = doc.createAttribute("content");
    content.value = "width=device-width";
    meta.setAttributeNode(content);
    doc.head.appendChild(meta);

    //create form, append to new window and submit
    const form = this.createForm(doc, token);
    doc.body.appendChild(form);
    form.submit();

    return this.tabWindow;
  }

  getHostnameFromUrl(url: string): string {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (error) {
      console.error(`Invalid URL:"${url}"`, error);
      return window.location.hostname;
    }
  }

  isMessageFromHpp(origin: string, hppUrl: string): boolean {
    return this.getHostnameFromUrl(origin) === this.getHostnameFromUrl(hppUrl);
  }

  receiveMessage(
    lightboxInstance: any,
    merchantUrl: string,
    isEmbedded?: boolean,
  ): (event: MessageEvent) => void {
    return (event: MessageEvent) => {
      try {
        //Check the origin of the response comes from HPP
        if (!this.isMessageFromHpp(event.origin, this.hppUrl)) {
          return;
        }

        // check for iframe resize values
        if (
          event.data &&
          typeof event.data === "string" &&
          JSON.parse(event.data).iframe
        ) {
          if (!this.isMobileNewTab) {
            const iframeWidth = JSON.parse(event.data).iframe.width;
            const iframeHeight = JSON.parse(event.data).iframe.height;

            let iFrame;
            let resized = false;

            if (isEmbedded) {
              iFrame = lightboxInstance.getIframe();
            } else {
              iFrame = document.getElementById("rxp-frame-" + randomId);
            }

            if (iframeWidth === "390px" && iframeHeight === "440px") {
              iFrame.setAttribute("width", iframeWidth);
              iFrame.setAttribute("height", iframeHeight);
              resized = true;
            }

            iFrame.style.backgroundColor = "#ffffff";

            if (this.isMobileIFrame) {
              iFrame.style.marginLeft = "0px";
              iFrame.style.WebkitOverflowScrolling = "touch";
              iFrame.style.overflowX = "scroll";
              iFrame.style.overflowY = "scroll";

              if (!isEmbedded) {
                const overlay = document.getElementById(
                  "rxp-overlay-" + randomId,
                );
                if (overlay) {
                  overlay.style.overflowX = "scroll";
                  overlay.style.overflowY = "scroll";
                }
              }
            } else if (!isEmbedded && resized) {
              iFrame.style.marginLeft =
                (parseInt(iframeWidth.replace("px", ""), 10) / 2) * -1 + "px";
            }

            if (!isEmbedded && resized) {
              // wrap the below in a setTimeout to prevent a timing issue on a
              // cache-miss load
              setTimeout(function () {
                const closeButton = document.getElementById(
                  "rxp-frame-close-" + randomId,
                );
                if (closeButton) {
                  closeButton.style.marginLeft =
                    parseInt(iframeWidth.replace("px", ""), 10) / 2 - 7 + "px";
                }
              }, 200);
            }
          }
        } else {
          if (this.isMobileNewTab && this.tabWindow) {
            //Close the new window
            this.tabWindow.close();
          } else {
            //Close the lightbox
            lightboxInstance.close();
          }

          const response = event.data;

          //Create a form and submit the hpp response to the merchant's response url
          const form = document.createElement("form");
          form.setAttribute("method", "POST");
          form.setAttribute("action", merchantUrl);

          form.appendChild(this.createFormHiddenInput("hppResponse", response));

          document.body.appendChild(form);

          form.submit();
        }
      } catch (error) {
        console.error("Error receiving message from HPP", { error, event });
      }
    };
  }
}

class RxpLightBox {
  private static instance: RxpLightBox;
  private overlayElement: HTMLDivElement | undefined;
  private spinner: HTMLImageElement | undefined;
  private iFrame: HTMLIFrameElement | undefined;
  private closeButton: HTMLImageElement | undefined;
  private token: any;
  private isLandscape: boolean;
  private internal: RealexHppUtils;

  private constructor(internal: RealexHppUtils) {
    this.internal = internal;
    this.isLandscape = internal.checkDevicesOrientation();

    if (this.internal.isMobileIFrame) {
      if (window.addEventListener) {
        window.addEventListener(
          "orientationchange",
          () => {
            this.isLandscape = this.internal.checkDevicesOrientation();
          },
          false,
        );
      }
    }
  }

  public static getInstance(
    internal: RealexHppUtils,
    hppToken?: any,
  ): RxpLightBox {
    if (!RxpLightBox.instance) {
      RxpLightBox.instance = new RxpLightBox(internal);
    }

    if (hppToken) {
      RxpLightBox.instance.setToken(hppToken);
    }

    return RxpLightBox.instance;
  }

  public lightbox(): void {
    if (this.internal.isMobileNewTab) {
      this.internal.tabWindow = this.internal.openWindow(this.token);
    } else {
      this.overlayElement = this.internal.createOverlay();
      const temp = this.internal.createIFrame(this.overlayElement, this.token);
      this.spinner = temp.spinner;
      this.iFrame = temp.iFrame;
      this.closeButton = temp.closeButton;
    }
  }

  public close(): void {
    this.internal.closeModal(
      this.closeButton,
      this.iFrame,
      this.spinner,
      this.overlayElement,
    );
    this.overlayElement = undefined;
    this.spinner = undefined;
    this.iFrame = undefined;
    this.closeButton = undefined;
  }

  public setToken(hppToken: any): void {
    this.token = hppToken;
  }

  public init(
    idOfLightboxButton: string,
    merchantUrl: string,
    serverSdkJson: any,
  ): void {
    const lightboxInstance = RxpLightBox.getInstance(
      this.internal,
      serverSdkJson,
    );

    const lightboxButton = document.getElementById(idOfLightboxButton);
    if (lightboxButton) {
      if (lightboxButton.addEventListener) {
        lightboxButton.addEventListener(
          "click",
          () => lightboxInstance.lightbox(),
          true,
        );
      } else {
        (lightboxButton as any).attachEvent(
          "onclick",
          lightboxInstance.lightbox,
        );
      }
    }

    if (window.addEventListener) {
      window.addEventListener(
        "message",
        this.internal.receiveMessage(lightboxInstance, merchantUrl),
        false,
      );
    } else {
      (window as any).attachEvent(
        "message",
        this.internal.receiveMessage(lightboxInstance, merchantUrl),
      );
    }
  }
}

class RxpEmbedded {
  private static instance: RxpEmbedded;
  private iFrame: HTMLIFrameElement | undefined;
  private token: any;
  private internal: RealexHppUtils;
  public hppUrl: string = DEFAUT_HPP_TEST_URL;

  private getMessage: any;

  private constructor(internal: RealexHppUtils) {
    this.internal = internal;
  }

  public static getInstance(
    internal: RealexHppUtils,
    hppToken?: any,
  ): RxpEmbedded {
    if (!RxpEmbedded.instance) {
      RxpEmbedded.instance = new RxpEmbedded(internal);
    }
    if (hppToken) {
      RxpEmbedded.instance.setToken(hppToken);
    }
    return RxpEmbedded.instance;
  }

  public embedded(): void {
    if (!this.iFrame || !this.token) {
      return; // or throw an error, depending on desired behavior
    }
    const form = this.internal.createForm(document, this.token);
    if (this.iFrame.contentWindow?.document.body) {
      this.iFrame.contentWindow.document.body.appendChild(form);
    } else {
      this.iFrame.contentWindow?.document.appendChild(form);
    }
    form.submit();
    this.iFrame.style.display = "inherit";
  }

  public close(): void {
    if (this.iFrame) {
      this.iFrame.style.display = "none";
    }
  }

  public setToken(hppToken: any): void {
    this.token = hppToken;
  }

  public setIframe(iframeId: string): void {
    this.iFrame = document.getElementById(iframeId) as
      | HTMLIFrameElement
      | undefined;
  }

  public getIframe(): HTMLIFrameElement | undefined {
    return this.iFrame;
  }

  public receiveMessage(
    event: MessageEvent,
    onReceiveMesasge?: ((data: any) => void) | undefined,
  ) {
    if (!this.internal.isMessageFromHpp(event.origin, this.hppUrl)) {
      return;
    }
    if (this.iFrame) {
      try {
        console.log(event.data);
        if (
          event.data &&
          typeof event.data === "string" &&
          JSON.parse(event.data).iframe
        ) {
          if (!this.internal.isMobileNewTab) {
            var iframeWidth = JSON.parse(event.data).iframe.width;
            var iframeHeight = JSON.parse(event.data).iframe.height;

            if (iframeWidth === "390px" && iframeHeight === "440px") {
              this.iFrame.setAttribute("width", iframeWidth);
              this.iFrame.setAttribute("height", iframeHeight);
            }

            this.iFrame.style.backgroundColor = "#ffffff";

            if (this.internal.isMobileIFrame) {
              this.iFrame.style.marginLeft = "0px";
              (this.iFrame.style as any).WebkitOverflowScrolling = "touch";
              this.iFrame.style.overflowX = "scroll";
              this.iFrame.style.overflowY = "scroll";
            }
          }
        } else {
          this.iFrame.style.display = "none";
        }
      } catch (error) {
        console.log({ error, event });
        console.warn(error);
      }
    }

    if (typeof onReceiveMesasge === "function") {
      onReceiveMesasge.call(this, event.data);
    }
  }

  public init(
    idOfEmbeddedButton: string | null,
    idOfTargetIframe: string,
    merchantUrl: string | null,
    serverSdkJson: any,
    onReceiveMesasge?: (data: string) => void,
  ): void {
    this.setIframe(idOfTargetIframe);
    const form = this.internal.createForm(document, serverSdkJson);

    if (this.iFrame) {
      if (this.iFrame?.contentWindow?.document.body) {
        this.iFrame.contentWindow.document.body.appendChild(form);
      } else {
        this.iFrame?.contentWindow?.document.appendChild(form);
      }
      form.submit();
      this.iFrame.style.display = "inherit";
    }

    this.getMessage = (event: MessageEvent) =>
      this.receiveMessage.call(this, event, onReceiveMesasge);

    if (window.addEventListener) {
      window.addEventListener("message", this.getMessage, false);
    } else {
      (window as any).attachEvent("message", this.receiveMessage);
    }
  }
}

class RxpRedirect {
  private static instance: RxpRedirect;
  private token: any;
  private internal: RealexHppUtils;
  public redirectUrl: string = DEFAUT_HPP_TEST_URL;

  private constructor(internal: RealexHppUtils) {
    this.internal = internal;
  }

  public static getInstance(
    internal: RealexHppUtils,
    hppToken?: any,
  ): RxpRedirect {
    if (!RxpRedirect.instance) {
      RxpRedirect.instance = new RxpRedirect(internal);
    }
    if (hppToken) {
      RxpRedirect.instance.setToken(hppToken);
    }
    return RxpRedirect.instance;
  }

  public redirect(): void {
    if (!this.token) {
      return; // Or throw an error
    }
    const form = this.internal.createForm(document, this.token, true);
    document.body.append(form);
    form.submit();
  }

  public setToken(hppToken: any): void {
    this.token = hppToken;
  }

  public init(
    idOfButton: string,
    merchantUrl: string,
    serverSdkJson: any,
  ): void {
    const redirectInstance = RxpRedirect.getInstance(
      this.internal,
      serverSdkJson,
    );
    redirectInstance.redirectUrl = merchantUrl; // Store merchantUrl within the instance

    const button = document.getElementById(idOfButton);
    if (button) {
      if (button.addEventListener) {
        button.addEventListener(
          "click",
          () => redirectInstance.redirect(),
          true,
        );
      } else {
        (button as any).attachEvent("onclick", redirectInstance.redirect);
      }
    }

    if (window.addEventListener) {
      window.addEventListener(
        "message",
        this.internal.receiveMessage(redirectInstance, merchantUrl),
        false,
      );
    } else {
      (window as any).attachEvent(
        "message",
        this.internal.receiveMessage(redirectInstance, merchantUrl),
      );
    }
  }
}

const internal = new RealexHppUtils();

export class RealexHpp {
  public static setHppUrl = (url: string) => {
    internal.hppUrl = url;
  };

  public static lightbox = RxpLightBox.getInstance(internal);
  public static embedded = RxpEmbedded.getInstance(internal);
  public static redirect = RxpRedirect.getInstance(internal);

  public static init = this.lightbox.init;
}

export class RealexRemote {
  public validateCardNumber(cardNumber: string): boolean {
    if (!/^\d{12,19}$/.test(cardNumber)) {
      return false;
    }

    let sum = 0;
    let timesTwo = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      const digit = parseInt(cardNumber.substring(i, i + 1), 10);
      let addend = digit;

      if (timesTwo) {
        addend *= 2;
        if (addend > 9) {
          addend -= 9;
        }
      }

      sum += addend;
      timesTwo = !timesTwo;
    }

    return sum % 10 === 0;
  }

  public validateCardHolderName(cardHolderName: string): boolean {
    if (!cardHolderName || !cardHolderName.trim()) {
      return false;
    }

    return /^[\u0020-\u007E\u00A0-\u00FF]{1,100}$/.test(cardHolderName);
  }

  public validateCvn(cvn: string): boolean {
    return /^\d{3}$/.test(cvn);
  }

  public validateAmexCvn(cvn: string): boolean {
    return /^\d{4}$/.test(cvn);
  }

  public validateExpiryDateFormat(expiryDate: string): boolean {
    if (!/^\d{4}$/.test(expiryDate)) {
      return false;
    }

    const month = parseInt(expiryDate.substring(0, 2), 10);
    // const year = parseInt(expiryDate.substring(2, 4), 10);  Not used in this function

    return month >= 1 && month <= 12;
  }

  public validateExpiryDateNotInPast(expiryDate: string): boolean {
    if (!this.validateExpiryDateFormat(expiryDate)) {
      return false;
    }

    const month = parseInt(expiryDate.substring(0, 2), 10);
    const year = parseInt(expiryDate.substring(2, 4), 10);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100; // Use two-digit year

    return (
      year > currentYear || (year === currentYear && month >= currentMonth)
    );
  }
}
