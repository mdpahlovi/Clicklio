/* eslint-disable react-refresh/only-export-components */
import { Canvas } from "@/types";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export const GET_CANVASES = gql`
    query GetCanvases {
        canvases {
            code
            name
            image
            createdAt
        }
    }
`;

export default function Home() {
    const { loading, data } = useQuery(GET_CANVASES);

    return (
        <section className="min-h-[calc(100vh_-_244px)]">
            <h1>All Canvas</h1>
            <div className="grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {loading
                    ? [...Array(4)].map((_, idx) => <Skeleton key={idx} className="h-48 rounded-lg" />)
                    : data?.canvases?.map(({ code, image, name, createdAt }: Canvas) => (
                          <Link key={code} to={`/canvas/${code}`} className="group">
                              <img src={image} alt="" className="w-full h-48 bg-muted object-cover object-center rounded-lg" />
                              <div className="flex flex-wrap justify-between items-center p-2">
                                  <h5 className="group-hover:underline md:text-lg">{name}</h5>
                                  <h6>{formatDistance(new Date(), new Date(Number(createdAt)))}</h6>
                              </div>
                          </Link>
                      ))}
            </div>
        </section>
    );
}
