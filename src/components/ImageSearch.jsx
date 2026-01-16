import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Input, Button } from "@heroui/react";

export default function ImageSearch() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        if (!searchTerm.trim()) return;
        const query = `${searchTerm} (site:jw.org OR site:wol.jw.org)`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
        window.open(url, '_blank');
    };

    return (
        <Card className="w-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-visible transition-colors hover:border-white/20">
            <CardHeader className="flex flex-col items-start px-6 pt-6 pb-2">
                <h2 className="text-2xl font-bold text-white">Image Search</h2>
                <p className="text-small text-primary-300/80">Search for images on JW.org</p>
            </CardHeader>
            <CardBody className="px-6 py-6 flex flex-col gap-4">
                <Input
                    placeholder="Enter search keyword..."
                    variant="bordered"
                    radius="full"
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    classNames={{
                        inputWrapper: "bg-white/10 border-white/20 data-[hover=true]:bg-white/20 backdrop-blur-md transition-all duration-300",
                        input: "text-white placeholder:text-white/50 text-center"
                    }}
                />

                <Button
                    size="lg"
                    radius="full"
                    onPress={handleSearch}
                    className="font-bold mt-2 px-8 py-3 text-lg bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-400 hover:to-primary-600 text-black shadow-lg shadow-primary-500/30 transition-[transform,shadow] active:scale-95 self-center"
                    variant="shadow"
                >
                    Search Images
                </Button>
            </CardBody>
        </Card>
    );
}
