import { GRAPHQL_URLS, SCRIPT_CUSTOM_EVENT_NAME } from "../constants";

(function () {
  const XHR = XMLHttpRequest.prototype;
  const originalOpen = XHR.open;
  const originalSend = XHR.send;
  XHR.open = function (_, url) {
    (this as any)._url = url;
    return originalOpen.apply(this, arguments as any);
  };
  XHR.send = function (postData) {
    this.addEventListener("load", function () {
      const url = (this as any)._url;

      if (!GRAPHQL_URLS.includes(url)) return;

      // converting Blob response to string
      var reader = new FileReader();
      reader.onload = (event) => {
        try {
          const responseData = JSON.parse(event!.target!.result as any);
          document.dispatchEvent(
            new CustomEvent(SCRIPT_CUSTOM_EVENT_NAME, {
              detail: {
                url: url,
                requestBody: JSON.parse(postData as string),
                responseBody: responseData,
              },
            } as any)
          );
        } catch (e) {}
      };
      reader.readAsText(this.response);
    });
    return originalSend.apply(this, arguments as any);
  };
})();
