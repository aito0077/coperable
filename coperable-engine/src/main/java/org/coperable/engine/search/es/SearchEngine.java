package org.coperable.engine.search.es;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.json.JsonXContentParser;
import org.elasticsearch.node.Node;
import org.elasticsearch.search.SearchHit;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;
import static org.elasticsearch.index.query.QueryBuilders.termQuery;
import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

public class SearchEngine {
    public static final int DEFAULT_MAX_RESULTS = 50;

    public static final String ID_HEADER = "ENTITY_ID";
    public static final String TYPE_HEADER = "ENTITY_TYPE";
    public static final String QUERY_HEADER = "query";
    public static final String FIELD_HEADER = "field_search";

    private final Client fClient;
    private final Node fNode;
    private final String fIndex;

    private int fMaxResults = DEFAULT_MAX_RESULTS;

    public SearchEngine(String index) {
        fIndex = index;
        fNode = nodeBuilder().client(true).clusterName("elasticsearch").node();
        fClient = fNode.client();
    }

    public String getIndex() {
        return fIndex;
    }

    public int getMaxResults() {
        return fMaxResults;
    }

    public void setMaxResults(int maxResults) {
        fMaxResults = maxResults;
    }

    public List<String> search(Exchange exchange) {
        Message in = exchange.getIn();
        String query = in.getHeader(QUERY_HEADER, String.class);
        String field = in.getHeader(FIELD_HEADER, String.class);
        System.out.println("AITO: DEBUG: query: "+query);
        SearchResponse searchResponse = search(field, query, getMaxResults(), getIndex());

        List<String> results = new ArrayList<String>();

        for (SearchHit hit : searchResponse.getHits()) {
            System.out.println("HIT: "+hit.getSource());
            results.add(hit.id());
        }

        return results;
    }
    
    public void index(Exchange exchange) {
        Message in = exchange.getIn();
        String id = in.getHeader(ID_HEADER, String.class);
        String type = in.getHeader(TYPE_HEADER, String.class);
        String content = in.getBody(String.class);
        try {
            System.out.println("AITO: DEBUG: ES: index: "+getIndex()+" - Type: "+type+" - ID: "+id+" - Content: "+content);
            index(getIndex(), type, id, content);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void close() {
        fNode.close();
        fClient.close();
    }

    private IndexResponse index(String index, String type, String id, String source) throws IOException {
        return fClient.prepareIndex(index, type, id).setSource(source).execute().actionGet();
    }

    private SearchResponse search(String fieldName, String query, int maxResults, String indexes) {
        System.out.println("search: Field Name: "+fieldName+" - Query: "+query+" - Indexes: "+indexes);
        return fClient.prepareSearch(indexes)
        .setSearchType(SearchType.DEFAULT)
        .setQuery(termQuery(fieldName, query))
        .setFrom(0).setSize(maxResults).setExplain(true)
        .execute()
        .actionGet();
    }


}
