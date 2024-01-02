import moment from "moment";
import { Canvas } from "@/types";
import { useQuery } from "@apollo/client";
import { GET_CANVASES } from "@/graphql/queries";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
    const { loading, data } = useQuery(GET_CANVASES, { fetchPolicy: "no-cache" });

    return (
        <section className="min-h-[calc(100vh_-_244px)] space-y-8">
            <h1>All Canvas</h1>
            <div className="grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {loading
                    ? [...Array(4)].map((_, idx) => <Skeleton key={idx} className="h-48 rounded-lg" />)
                    : data?.canvases?.map(({ code, image, name, createdAt }: Canvas) => (
                          <Link key={code} to={`/canvas/${code}`} className="group">
                              <img src={image} alt="" className="w-full h-48 bg-muted object-cover object-center rounded-lg" />
                              <div className="flex flex-wrap justify-between items-center p-2">
                                  <h5 className="group-hover:underline md:text-lg">{name}</h5>
                                  <h6>{moment(Number(createdAt)).fromNow(true)}</h6>
                              </div>
                          </Link>
                      ))}
            </div>
        </section>
    );
}
