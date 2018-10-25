# DEMO_HASH = 'QmavE42xtK1VovJFVTVkCR5Jdf761QWtxmvak9Zx718TVr'  # archive of ipfs websites
DEMO_HASH = 'QmX5smVTZfF8p1VC8Y3VtjGqjvDVPWvyBk24JgvnMwHtjC'  # archive of ipfs websites

DEBUG = true
API_REFS_FORMAT = encodeURIComponent '<src> <dst> <linkname>'

# ipfsAPI = require "ipfs-api"
# ipfs = ipfsAPI "/ip4/127.0.0.1/tcp/5001"

app = ->
  hash = window.location.hash[1..]
  if hash.length > 0
    render hash
  else
    window.location.hash = '#'+DEMO_HASH
    window.location.reload()

render = (hash) ->
  refs = "/api/v0/refs?arg=#{hash}&recursive&format=#{API_REFS_FORMAT}" #ipfs refs api
  bitswapStat = "/api/v0/bitswap/stat" # fail
  blockStat = "/api/v0/block/stat?arg=#{hash}"
  get = "/api/v0/block/get?arg=#{hash}"
  cat = "/api/v0/cat?arg=#{hash}" # fail
  ls = "/api/v0/file/ls?arg=#{hash}" #fail
  findpeer = "/api/v0/dht/findpeer?arg=#{hash}" #fail
  objdata = "/api/v0/object/data?arg=#{hash}"
  objlinks = "/api/v0/object/links?arg=#{hash}"
  objstat = "/api/v0/object/stat?arg=#{hash}"
  swmaddrs = "/api/v0/swarm/addrs" #fail
  # console.log get
  # d3.xhr bitswapStat, (error, xhr) ->
  #   bitswapstat = xhr.responseText
  #   console.log bitswapstat
  # d3.xhr blockStat, (error, xhr) ->
  #   stat = xhr.responseText
  #   console.log stat
  #   console.log "------------------------"
  # d3.xhr get, (error, xhr) ->
  #   getData = xhr.responseText
  #   console.log getData
  # d3.xhr cat, (error, data) ->
  #   catData = data.responseText
  #   console.log catData
  # d3.xhr ls, (error, xhr) ->
  #   lsData = xhr.responseText
  #   console.log lsData
  # d3.xhr findpeer, (error, xhr) ->
  #   fpeerData = xhr.responseText
  #   console.log fpeerData
  # d3.xhr objdata, (error, xhr) ->
  #   objData = xhr.responseText
  #   console.log objData
  #   console.log "------------------------"
  # d3.xhr objlinks, (error, xhr) ->
  #   objLinks = xhr.responseText
  #   console.log objLinks
  #   console.log "------------------------"
  d3.xhr objstat, (error, xhr) ->
    objStat = xhr.responseText
    console.log objStat
    console.log "------------------------"
  d3.xhr swmaddrs, (error, xhr) ->
    swmAddrs = xhr.responseText
    console.log swmAddrs
    console.log "------------------------"
  d3.xhr refs, (error, xhr) ->
    data = xhr.responseText
    # console.log(data)
    tree = {}
    lines = data.split "\n" #まとまったjsonを1つずつにする
    for line in lines
      continue unless line.trim()
      datum = JSON.parse line
      [src, dst, linkname] = datum.Ref.split ' ' #受け取ったデータを仕分け
      if src and dst and linkname   # links with no name are file chunks, ignore those
        tree[src] ?= []
        tree[src].push
          Hash: dst
          Name: linkname

    children = getDecendants hash, tree

    @root = children: children
    @root.x0 = h / 2
    @root.y0 = 0
    @root.children.forEach toggleAll
    update @root

getDecendants = (ref, dict) ->
  throw new Error unless ref? and dict?
  children = dict[ref]
  if children?
    for child in children
      throw new Error unless child.Hash?
      decendants = getDecendants child.Hash, dict
      child.children = decendants if decendants?
    children

d = debug = (args...) ->
  if DEBUG
    console.debug args...

app()



# Format of internal `tree`:
#
# {
#   "Qmcav25eTinMV632w9zdyXsFENDz5FCWjrMEVU7Nzy2v98": [
#     {
#       "Name": "app.js",
#       "Hash": "QmZs8mitpfSZM8TaFas9WaDVF77aQvb47UEPR1g1quoQq9"
#     },
#     {
#       "Name": "lib",
#       "Hash": "QmSXq83RU9YFnxGS7N29gBqjMXTg3qHERzrfFZxKYCGknM"
#     }
#   ],
#   "QmSXq83RU9YFnxGS7N29gBqjMXTg3qHERzrfFZxKYCGknM": [
#     {
#       "Name": "d3.js",
#       "Hash": "QmbgWP6n7wmczy9YP79FpDRUjYhyjVKjdDHTm9SS9nadZR",
#     }
#   ]
# }


# Final D3 format:
#
# {
#   "Name": "",
#   "children": [
#     {
#       "Hash": "QmZs8mitpfSZM8TaFas9WaDVF77aQvb47UEPR1g1quoQq9",
#       "Name": "app.js"
#     },
#     {
#       "Hash": "QmSXq83RU9YFnxGS7N29gBqjMXTg3qHERzrfFZxKYCGknM",
#       "Name": "lib",
#       "children": [
#         {
#           "Hash": "Qmei6UeQ3LKeKUfzKLx8SRsmxVpvvWrLmZTkKapCoQnYgf",
#           "Name": "d3",
#           "children": [
#             {
#               "Hash": "QmbgWP6n7wmczy9YP79FpDRUjYhyjVKjdDHTm9SS9nadZR",
#               "Name": "d3.js"
#             }
#           ]
#         }
#       ]
#     }
#   ]
# }
