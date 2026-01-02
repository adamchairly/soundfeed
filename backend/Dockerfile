FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# copy project files
COPY Directory.Packages.props .
COPY Soundfeed.Api/Soundfeed.Api.csproj Soundfeed.Api/
COPY Soundfeed.Bll/Soundfeed.Bll.csproj Soundfeed.Bll/
COPY Soundfeed.Dal/Soundfeed.Dal.csproj Soundfeed.Dal/

# Rrstore dependencies
RUN dotnet restore Soundfeed.Api/Soundfeed.Api.csproj

# copy source files
COPY . .

# build and publish
WORKDIR /src/Soundfeed.Api
RUN dotnet publish -c Release -o /app/publish

# runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Soundfeed.Api.dll"]