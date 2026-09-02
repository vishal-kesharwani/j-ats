import { ApplicationEvent } from "@/types";
import { formatDate } from "@/lib/utils";

interface TimelineProps {
  events: ApplicationEvent[];
}

export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-[#B0AEA8]">No events yet.</p>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, idx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {idx !== events.length - 1 && (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-px bg-[#EAEAEA]"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center bg-[#111111] ring-4 ring-white">
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1">
                  <div>
                    <p className="text-sm font-medium text-[#111111]">
                      {event.event}
                    </p>
                    {event.notes && (
                      <p className="mt-0.5 text-xs text-[#787774]">{event.notes}</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-xs text-[#B0AEA8]">
                    {formatDate(event.eventDate)}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
