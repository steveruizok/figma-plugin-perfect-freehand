import * as React from "react"

export function Component(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 12 12"
      {...props}
    >
      <path
        fill="currentColor"
        fillOpacity="0.4"
        d="M3.743 2.748L6 .5l2.257 2.248L6 4.996 3.743 2.748zm-.995 5.51L.5 6l2.248-2.257L4.996 6 2.748 8.257v.001zm5.51.994L6 11.5 3.743 9.252 6 7.004l2.257 2.248h.001zM11.5 6L9.252 3.743 7.004 6l2.248 2.257L11.5 6z"
      ></path>
    </svg>
  )
}

export function Frame(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 12 12"
      {...props}
    >
      <path
        fill="currentColor"
        fillOpacity="0.4"
        fillRule="evenodd"
        d="M4 .5V3h4V.5h1V3h2.5v1H9v4h2.5v1H9v2.5H8V9H4v2.5H3V9H.5V8H3V4H.5V3H3V.5h1zM8 8V4H4v4h4z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

export function Close(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.4"
        d="M12 4l-8 8M4 4l8 8"
      ></path>
    </svg>
  )
}

export function Instance(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 14 14"
      {...props}
    >
      <path
        fill="currentColor"
        fillOpacity="0.4"
        fillRule="evenodd"
        d="M.828 7L7 .828 13.172 7 7 13.172.828 7zM7 11.828L11.828 7 7 2.172 2.172 7 7 11.828z"
      ></path>
    </svg>
  )
}

export function Success(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} viewBox="0 0 21 21" fill="none" {...props}>
      <path
        d="M18.5 10.058v.775a8.333 8.333 0 11-4.942-7.616"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.333 3.333L10.167 12.5l-2.5-2.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Link(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="prefix__svg"
      width={13}
      height={13}
      viewBox="0 0 13 13"
      {...props}
    >
      <path
        d="M11.555.878a3.002 3.002 0 00-4.242 0l-.708.707a2.995 2.995 0 00-.777 2.898l.902-.901c.028-.47.223-.93.582-1.29l.708-.707a2 2 0 012.828 2.829l-.707.707c-.36.359-.82.554-1.29.582l-.902.902a2.997 2.997 0 002.899-.777l.707-.707a3 3 0 000-4.243zM.879 11.555a3.002 3.002 0 004.242 0l.707-.708a2.992 2.992 0 00.777-2.898l-.902.902c-.027.47-.223.93-.582 1.29l-.707.706a1.999 1.999 0 11-2.828-2.828l.707-.707c.36-.359.82-.554 1.289-.582l.902-.902a2.995 2.995 0 00-2.898.777l-.707.707a3 3 0 000 4.243zm7.848-7.141l-.707-.707-4.243 4.242.707.708 4.243-4.243z"
        fillRule="evenodd"
        fill="currentColor"
      />
    </svg>
  )
}

export function Alert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <path
        clipRule="evenodd"
        d="M10 18.333a8.333 8.333 0 100-16.666 8.333 8.333 0 000 16.666z"
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.667V10"
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={10}
        cy={13.333}
        fill="currentColor"
        fillOpacity={0.4}
        r={0.833}
      />
    </svg>
  )
}
